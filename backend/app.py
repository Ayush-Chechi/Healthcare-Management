
from flask import Flask, send_from_directory, request, jsonify, session, redirect, url_for
import os, json, csv, uuid, datetime, random
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

HERE = os.path.dirname(__file__)
ROOT = os.path.abspath(os.path.join(HERE, '..'))
FRONTEND = os.path.join(ROOT, 'frontend')
DATA_DIR = os.path.join(HERE, 'data')
POSTS_FILE = os.path.join(DATA_DIR, 'posts.json')
APPTS_FILE = os.path.join(DATA_DIR, 'appointments.csv')
MOOD_FILE = os.path.join(DATA_DIR, 'mood.json')
TIPS_FILE = os.path.join(DATA_DIR, 'tips.json')
USERS_FILE = os.path.join(DATA_DIR, 'users.json')
UPLOAD_DIR = os.path.join(HERE, 'uploads')

# Load environment variables from a local .env file (no effect in most production setups
# where env vars are injected by the platform).
load_dotenv()

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ensure files exist
if not os.path.exists(POSTS_FILE):
    with open(POSTS_FILE, 'w') as f:
        json.dump([], f, indent=2)
if not os.path.exists(APPTS_FILE):
    with open(APPTS_FILE, 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['id','name','email','mode','datetime','subject','created_at'])
if not os.path.exists(MOOD_FILE):
    with open(MOOD_FILE, 'w') as f:
        json.dump([], f, indent=2)
if not os.path.exists(TIPS_FILE):
    with open(TIPS_FILE, 'w') as f:
        json.dump([
            "Take 5 minutes to focus on your breathing — inhale for 4, hold for 4, exhale for 4.",
            "Short walks outside can improve mood and clarity. Try a 10-minute walk today.",
            "Limit screen time 30 minutes before bed to improve sleep quality.",
            "Break tasks into 25-minute focused sessions (Pomodoro) with 5-minute breaks.",
            "Talk to a friend or peer — sharing how you feel can reduce stress."
        ], f, indent=2)
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, 'w') as f:
        json.dump([], f, indent=2)

app = Flask(__name__, static_folder=FRONTEND, static_url_path='')
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['UPLOAD_FOLDER'] = UPLOAD_DIR
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2MB

def read_json(path):
    with open(path, 'r') as f:
        return json.load(f)
def write_json(path, data):
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, default=str)

@app.route('/resources/<path:filename>')
def resources_static(filename):
    return send_from_directory(os.path.join(FRONTEND, 'resources'), filename)

@app.route('/')
def index():
    return send_from_directory(FRONTEND, 'index.html')
@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(FRONTEND, path)

# Auth endpoints
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    email = data.get('email','').strip().lower()
    password = data.get('password','')
    if not email or not password:
        return jsonify({'success':False, 'error':'email and password required'}), 400
    users = read_json(USERS_FILE)
    if any(u.get('email')==email for u in users):
        return jsonify({'success':False, 'error':'email exists'}), 400

    user = {
        'id': str(uuid.uuid4())[:8],
        'name': data.get('name','')[:200],
        'email': email,
        'password_hash': generate_password_hash(password),
        'age': data.get('age'),
        'gender': data.get('gender'),
        'year': data.get('year'),
        'major': data.get('major'),
        'stress': data.get('stress'),
        'sleep': data.get('sleep'),
        'counseling': data.get('counseling'),
        'created_at': datetime.datetime.utcnow().isoformat(),
        'profile_pic': None,
        'tokens': 100  # <-- initial tokens for signup
    }
    users.append(user)
    write_json(USERS_FILE, users)
    session['user_email'] = email
    session['user'] = {k:v for k,v in user.items() if k!='password_hash'}
    return jsonify({'success':True, 'tokens': user['tokens']})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email','').strip().lower()
    password = data.get('password','')
    users = read_json(USERS_FILE)
    user = next((u for u in users if u.get('email')==email), None)
    if not user or not check_password_hash(user.get('password_hash',''), password):
        return jsonify({'success':False, 'error':'invalid credentials'}), 401
    session['user_email'] = email
    session['user'] = {k:v for k,v in user.items() if k!='password_hash'}
    return jsonify({'success':True})

@app.route('/api/logout')
def logout():
    session.pop('user_email', None)
    session.pop('user', None)
    return jsonify({'success':True})

@app.route('/api/profile')
def profile():
    if 'user_email' not in session:
        return jsonify({'error':'not logged in'}), 401
    users = read_json(USERS_FILE)
    user = next((u for u in users if u.get('email')==session['user_email']), None)
    if not user:
        return jsonify({'error':'not found'}), 404
    public = {k:v for k,v in user.items() if k!='password_hash'}
    # tokens included automatically
    return jsonify(public)

# Upload profile pic
@app.route('/api/upload_profile_pic', methods=['POST'])
def upload_profile_pic():
    if 'user_email' not in session:
        return jsonify({'success':False, 'error':'not logged in'}), 401
    if 'file' not in request.files:
        return jsonify({'success':False, 'error':'no file'}), 400
    file = request.files['file']
    filename = secure_filename(file.filename)
    if filename == '':
        return jsonify({'success':False, 'error':'invalid filename'}), 400
    ext = os.path.splitext(filename)[1] or '.png'
    safe_name = session['user_email'].replace('@','_at_') + ext
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], safe_name)
    file.save(save_path)
    users = read_json(USERS_FILE)
    for u in users:
        if u.get('email') == session['user_email']:
            u['profile_pic'] = f"/uploads/{safe_name}"
    write_json(USERS_FILE, users)
    session['user']['profile_pic'] = f"/uploads/{safe_name}"
    return jsonify({'success':True, 'profile_pic': f"/uploads/{safe_name}"})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Chat endpoint (uses Hugging Face Inference API)
import requests


def require_env(name: str) -> str:
    """
    Fetch a required environment variable, failing fast with a clear error
    if it is not set. The value itself is never logged.
    """
    value = os.getenv(name)
    if not value:
        # Do not log the secret itself, only the variable name.
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


# Hugging Face access token must be provided via environment variable HF_TOKEN.
# For local development, put HF_TOKEN in a .env file (which must NOT be committed),
# and in production / CI configure it in your platform's secret settings.
HF_TOKEN = require_env("HF_TOKEN")
MODEL_ID = "microsoft/DialoGPT-medium"  # you can try others too

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    user_msg = data.get("q", "").strip()
    if not user_msg:
        return jsonify({"reply": "Please type something."})

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "inputs": user_msg,
        "parameters": {
            "max_new_tokens": 150,
            "temperature": 0.7
        }
    }

    try:
        url = f"https://api-inference.huggingface.co/models/{MODEL_ID}"
        resp = requests.post(url, headers=headers, json=payload)
        resp.raise_for_status()
        result = resp.json()

        # Different models return different JSON formats
        if isinstance(result, list) and "generated_text" in result[0]:
            bot_reply = result[0]["generated_text"]
        elif isinstance(result, dict) and "generated_text" in result:
            bot_reply = result["generated_text"]
        else:
            bot_reply = str(result)

        return jsonify({"reply": bot_reply})

    except Exception as e:
        return jsonify({"reply": "Sorry, error: " + str(e)})

# Booking
@app.route('/api/book', methods=['POST'])
def book():
    data = request.get_json() or {}
    name = data.get('name') or 'Anonymous'
    email = data.get('email') or ''
    mode = data.get('mode') or 'online'
    when = data.get('datetime') or ''
    subject = data.get('subject') or ''
    appt_id = str(uuid.uuid4())[:8]
    now = datetime.datetime.utcnow().isoformat()
    try:
        with open(APPTS_FILE, 'a', newline='') as f:
            w = csv.writer(f)
            w.writerow([appt_id, name, email, mode, when, subject, now])
        confirm = f"Appointment {appt_id} confirmed for {when} ({mode})."
        return jsonify({'success':True, 'id':appt_id, 'confirmation': confirm})
    except Exception as e:
        return jsonify({'success':False, 'error':str(e)}), 500

# Posts / Forum
def read_posts():
    with open(POSTS_FILE, 'r') as f:
        return json.load(f)
def write_posts(posts):
    with open(POSTS_FILE, 'w') as f:
        json.dump(posts, f, indent=2, default=str)

@app.route('/api/posts', methods=['POST'])
def posts():
    data = request.get_json() or {}
    content = data.get('content','').strip()
    author = data.get('author') or (session.get('user',{}).get('name') if session.get('user') else 'Anonymous')
    if not content:
        return jsonify({'success':False, 'error':'empty'}), 400
    posts = read_posts()
    new = {'id': str(uuid.uuid4())[:8], 'author': author, 'content': content, 'created_at': datetime.datetime.utcnow().isoformat(), 'approved': False, 'likes': 0, 'comments': [], 'user_email': session.get('user_email')}
    posts.append(new)
    write_posts(posts)

    # Add tokens for posting
    users = read_json(USERS_FILE)
    for u in users:
        if u.get('email') == session.get('user_email'):
            u['tokens'] = u.get('tokens',0) + 10  # give 10 tokens per post
    write_json(USERS_FILE, users)

    return jsonify({'success':True, 'id': new['id'], 'tokens': next(u['tokens'] for u in users if u.get('email') == session.get('user_email'))})

@app.route('/api/posts/<pid>/like', methods=['POST'])
def like_post(pid):
    posts = read_posts()
    for p in posts:
        if p.get('id') == pid:
            p['likes'] = p.get('likes',0) + 1
            write_posts(posts)
            return jsonify({'success':True})
    return jsonify({'success':False}), 404

@app.route('/api/posts/<pid>/comment', methods=['POST'])
def comment_post(pid):
    data = request.get_json() or {}
    author = data.get('author') or (session.get('user',{}).get('name') if session.get('user') else 'Anonymous')
    text = data.get('text','').strip()
    if not text:
        return jsonify({'success':False,'error':'empty'}),400
    posts = read_posts()
    for p in posts:
        if p.get('id') == pid:
            comment = {'id': str(uuid.uuid4())[:8], 'author': author, 'text': text, 'created_at': datetime.datetime.utcnow().isoformat()}
            p.setdefault('comments', []).append(comment)
            write_posts(posts)
            return jsonify({'success':True})
    return jsonify({'success':False}),404

# Admin endpoints
@app.route('/api/admin/pending')
def admin_pending():
    posts = read_posts()
    pending = [p for p in posts if not p.get('approved')]
    return jsonify(pending)
@app.route('/api/admin/approve', methods=['POST'])
def admin_approve():
    pid = request.get_json().get('id')
    posts = read_posts()
    for p in posts:
        if p.get('id') == pid:
            p['approved'] = True
            write_posts(posts)
            return jsonify({'success':True})
    return jsonify({'success':False}),404
@app.route('/api/admin/delete', methods=['POST'])
def admin_delete():
    pid = request.get_json().get('id')
    posts = read_posts()
    new = [p for p in posts if p.get('id') != pid]
    if len(new) != len(posts):
        write_posts(new)
        return jsonify({'success':True})
    return jsonify({'success':False}),404

# Mood tracking
def read_mood():
    with open(MOOD_FILE, 'r') as f:
        return json.load(f)
def write_mood(entries):
    with open(MOOD_FILE, 'w') as f:
        json.dump(entries, f, indent=2, default=str)
@app.route('/api/mood', methods=['GET','POST'])
def mood():
    if request.method == 'GET':
        entries = read_mood()
        entries_sorted = sorted(entries, key=lambda x: x.get('created_at',''), reverse=False)
        return jsonify(entries_sorted)
    else:
        data = request.get_json() or {}
        mood_val = int(data.get('mood',3))
        note = data.get('note','')[:500]
        entry = {'id': str(uuid.uuid4())[:8], 'mood': mood_val, 'note': note, 'created_at': datetime.datetime.utcnow().isoformat(), 'user_email': session.get('user_email')}
        entries = read_mood()
        entries.append(entry)
        write_mood(entries)
        return jsonify({'success':True, 'id': entry['id']})

# Tips
@app.route('/api/tips')
def tips():
    try:
        t = read_json(TIPS_FILE)
        return jsonify({'tip': random.choice(t) if t else ''})
    except:
        return jsonify({'tip':'Take a short break.'})

# Analytics
@app.route('/api/admin/analytics')
def analytics():
    appts = 0
    try:
        with open(APPTS_FILE,'r') as f:
            r = csv.reader(f)
            next(r,None)
            for _ in r: appts += 1
    except:
        appts = 0
    posts = len(read_posts())
    mood_entries = 0
    try:
        with open(MOOD_FILE,'r') as f:
            mood_entries = len(json.load(f))
    except:
        mood_entries = 0
    return jsonify({'appointments_total':appts,'posts_total':posts,'mood_entries_total':mood_entries,'sample_timestamp': datetime.datetime.utcnow().isoformat()})

# ---------------------------
# Consultant Section
# ---------------------------

CONSULTANT_EMAIL = "consultant@example.com"  # demo email
CONSULTANT_PASS = "demo123"                  # demo password

@app.route('/api/consultant/login', methods=['POST'])
def consultant_login():
    data = request.get_json() or {}
    email = data.get("email","").strip().lower()
    password = data.get("password","")
    if email == CONSULTANT_EMAIL and password == CONSULTANT_PASS:
        session['consultant_logged_in'] = True
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "invalid credentials"}), 401

@app.route('/api/consultant/logout')
def consultant_logout():
    session.pop('consultant_logged_in', None)
    return jsonify({"success": True})

@app.route('/api/consultant/appointments')
def consultant_appointments():
    if not session.get("consultant_logged_in"):
        return jsonify({"error": "unauthorized"}), 401
    appts = []
    try:
        with open(APPTS_FILE, 'r') as f:
            r = csv.DictReader(f)
            for row in r:
                row.pop('name', None)  # hide student name for confidentiality
                appts.append(row)
        appts.sort(key=lambda x: x.get('datetime',''))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify(appts)

@app.route('/api/consultant/email', methods=['POST'])
def consultant_email():
    if not session.get("consultant_logged_in"):
        return jsonify({"error": "unauthorized"}), 401
    data = request.get_json() or {}
    appt_id = data.get("id")
    message = data.get("message", "").strip()
    if not appt_id or not message:
        return jsonify({"error": "missing fields"}), 400

    # Find appointment by id
    recipient = None
    try:
        with open(APPTS_FILE, 'r') as f:
            r = csv.DictReader(f)
            for row in r:
                if row["id"] == appt_id:
                    recipient = row["email"]
                    break
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    if not recipient:
        return jsonify({"error": "appointment not found"}), 404

    # DEMO: log email instead of sending
    print(f"[CONSULTANT EMAIL DEMO]\nTo: {recipient}\nMessage: {message}\n")

    # To enable real email sending, uncomment and configure this block:
    """
    try:
        msg = MIMEText(message)
        msg['Subject'] = "Appointment Follow-up"
        msg['From'] = CONSULTANT_EMAIL
        msg['To'] = recipient

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login("your_gmail_here", "your_app_password")
            server.send_message(msg)
    except Exception as e:
        return jsonify({"error": "email send failed: " + str(e)}), 500
    """

    return jsonify({"success": True, "sent_to": recipient})

# ---------------------------
# Token System for Payments
# ---------------------------

@app.route('/api/tokens')
def get_tokens():
    if 'user_email' not in session:
        return jsonify({'success': False, 'error': 'not logged in'}), 401
    users = read_json(USERS_FILE)
    user = next((u for u in users if u.get('email') == session['user_email']), None)
    if not user:
        return jsonify({'success': False, 'error': 'not found'}), 404
    return jsonify({'success': True, 'tokens': user.get('tokens', 0)})

@app.route('/api/use_tokens', methods=['POST'])
def use_tokens():
    if 'user_email' not in session:
        return jsonify({'success': False, 'error': 'not logged in'}), 401
    data = request.get_json() or {}
    amount = int(data.get('amount', 0))
    if amount <= 0:
        return jsonify({'success': False, 'error': 'invalid amount'}), 400

    users = read_json(USERS_FILE)
    for u in users:
        if u.get('email') == session['user_email']:
            if u.get('tokens', 0) < amount:
                return jsonify({'success': False, 'error': 'not enough tokens'}), 400
            u['tokens'] -= amount
            write_json(USERS_FILE, users)
            session['user']['tokens'] = u['tokens']  # keep session in sync
            return jsonify({'success': True, 'remaining_tokens': u['tokens']})
    return jsonify({'success': False, 'error': 'user not found'}), 404

@app.route('/api/refund_tokens', methods=['POST'])
def refund_tokens():
    if 'user_email' not in session:
        return jsonify({'success': False, 'error': 'not logged in'}), 401

    data = request.get_json()
    refund_amount = int(data.get('amount', 0))

    users = read_json(USERS_FILE)
    for u in users:
        if u.get('email') == session['user_email']:
            u['tokens'] = u.get('tokens', 0) + refund_amount
            write_json(USERS_FILE, users)
            return jsonify({'success': True, 'tokens': u['tokens']})

    return jsonify({'success': False, 'error': 'user not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)



