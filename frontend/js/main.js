
/* main.js - handles auth, modals, and app features */
const landing = document.getElementById('landing');
const app = document.getElementById('app');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const profileModal = document.getElementById('profileModal');
const openLogin = document.getElementById('openLogin');
const openSignup = document.getElementById('openSignup');
const openProfile = document.getElementById('openProfile');
const logoutBtn = document.getElementById('logoutBtn');
// Translation dictionary
const translations = {
  en: {
    brand: "Digital Mental Health",
    aiChat: "AI Chat",
    moodTracker: "Mood Tracker",
    booking: "Booking",
    resources: "Resources",
    therapies: "Therapies",
    services: "Products/ Services",
    forum: "Peer Forum",
    signOut: "Sign Out",
    dashboard: "Dashboard",
    whatWeDo: "What we do",
    whatWeDoDesc: "We provide stigma-free, accessible mental health support for students: AI-guided first-aid, confidential counselling booking, psychoeducational resources in regional languages, peer support, mood tracking, and anonymous analytics to help institutions respond.",
    introTitle: "Our Services",
    introDesc: "We provide a holistic range of student-centered wellness services designed to nurture both mind and body. From yoga sessions and guided audio practices to therapeutic readings and spiritual therapies, you’ll find tools to restore balance. Our meal planning and routine manager help you build healthier daily habits, while physician consultations and mental health diagnosis ensure professional support when you need it most.",
    aiChatTitle: "AI-guided First-Aid Chat",
    aiChatPlaceholder: "Describe how you're feeling...",
    moodTrackerTitle: "Mood Tracker",
    moodTip: "Loading today's wellness tip...",
    moodLabel: "Select mood (1 = low — 5 = high)",
    moodNoteLabel: "Short note (optional)",
    moodNotePlaceholder: "How was your day?",
    logMood: "Log Mood",
    showMood: "Show Mood Progress",
    hideMood: "Hide Chart",
    bookingTitle: "Confidential Booking",
    bookingName: "Name",
    bookingEmail: "Email",
    bookingMode: "Mode",
    bookingModeOnline: "Online",
    bookingModeOffline: "On-campus",
    bookingDate: "Date & Time",
    bookingSubject: "Subject",
    bookBtn: "Book Appointment",
    resourcesTitle: "Psychoeducational Resources",
    resourcesFilter: "Filter by category:",
    resourcesSearch: "Search resources...",
    therapiesTitle: "Therapies",
    therapiesFilter: "Filter by category:",
    therapiesSearch: "Search therapies...",
    servicesTitle: "Services",
    servicesFilter: "Filter by category:",
    servicesSearch: "Search services...",
    forumTitle: "Peer Support Forum",
    forumNamePlaceholder: "Your display name (optional)",
    forumContentPlaceholder: "Write your post (no personal contact details)...",
    forumPostBtn: "Post",
    prototypeNote: "Prototype — not a substitute for professional care. In crisis, contact local emergency services or a helpline."
  },
  hi: {
    brand: "डिजिटल मानसिक स्वास्थ्य",
    aiChat: "एआई चैट",
    moodTracker: "मूड ट्रैकर",
    booking: "बुकिंग",
    resources: "संसाधन",
    therapies: "उपचार",
    services: "उत्पाद/सेवाएँ",
    forum: "सहपाठी मंच",
    signOut: "साइन आउट",
    dashboard: "डैशबोर्ड",
    whatWeDo: "हम क्या करते हैं",
    whatWeDoDesc: "हम छात्रों के लिए कलंक-मुक्त, सुलभ मानसिक स्वास्थ्य सहायता प्रदान करते हैं: एआई-आधारित प्राथमिक सहायता, गोपनीय परामर्श बुकिंग, क्षेत्रीय भाषाओं में शैक्षिक संसाधन, सहपाठी समर्थन, मूड ट्रैकिंग, और संस्थानों को प्रतिक्रिया देने में मदद करने के लिए गुमनाम एनालिटिक्स।",
    introTitle: "हमारी सेवाएँ",
    introDesc: "हम छात्रों के लिए समग्र कल्याण सेवाओं की एक श्रृंखला प्रदान करते हैं जो शरीर और मन दोनों का पोषण करती हैं। योग सत्रों और निर्देशित ऑडियो अभ्यासों से लेकर चिकित्सीय पठन और आध्यात्मिक उपचार तक, आपको संतुलन बहाल करने के उपकरण मिलेंगे। हमारा भोजन योजना और दिनचर्या प्रबंधक आपको स्वस्थ दैनिक आदतें बनाने में मदद करता है, जबकि चिकित्सक परामर्श और मानसिक स्वास्थ्य निदान आवश्यक होने पर पेशेवर समर्थन सुनिश्चित करता है।",
    aiChatTitle: "एआई-निर्देशित प्राथमिक उपचार चैट",
    aiChatPlaceholder: "बताएँ आप कैसा महसूस कर रहे हैं...",
    moodTrackerTitle: "मूड ट्रैकर",
    moodTip: "आज की वेलनेस टिप लोड हो रही है...",
    moodLabel: "मूड चुनें (1 = कम — 5 = अधिक)",
    moodNoteLabel: "संक्षिप्त नोट (वैकल्पिक)",
    moodNotePlaceholder: "आपका दिन कैसा रहा?",
    logMood: "मूड दर्ज करें",
    showMood: "मूड प्रगति दिखाएँ",
    hideMood: "चार्ट छुपाएँ",
    bookingTitle: "गोपनीय बुकिंग",
    bookingName: "नाम",
    bookingEmail: "ईमेल",
    bookingMode: "मोड",
    bookingModeOnline: "ऑनलाइन",
    bookingModeOffline: "कैंपस में",
    bookingDate: "तारीख और समय",
    bookingSubject: "विषय",
    bookBtn: "अपॉइंटमेंट बुक करें",
    resourcesTitle: "मनोशैक्षिक संसाधन",
    resourcesFilter: "श्रेणी द्वारा फ़िल्टर करें:",
    resourcesSearch: "संसाधन खोजें...",
    therapiesTitle: "उपचार",
    therapiesFilter: "श्रेणी द्वारा फ़िल्टर करें:",
    therapiesSearch: "उपचार खोजें...",
    servicesTitle: "सेवाएँ",
    servicesFilter: "श्रेणी द्वारा फ़िल्टर करें:",
    servicesSearch: "सेवाएँ खोजें...",
    forumTitle: "सहपाठी सहायता मंच",
    forumNamePlaceholder: "आपका डिस्प्ले नाम (वैकल्पिक)",
    forumContentPlaceholder: "अपनी पोस्ट लिखें (कोई व्यक्तिगत संपर्क विवरण नहीं)...",
    forumPostBtn: "पोस्ट करें",
    prototypeNote: "प्रोटोटाइप — पेशेवर देखभाल का विकल्प नहीं है। संकट की स्थिति में, स्थानीय आपातकालीन सेवाओं या हेल्पलाइन से संपर्क करें।"
  }
};

function applyTranslations(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  localStorage.setItem("lang", lang); // save preference
}


function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
document.querySelectorAll('.modal .close').forEach(el => el.addEventListener('click', e => { closeModal(el.getAttribute('data-close')) }));

openLogin.addEventListener('click', () => openModal('loginModal'));
openSignup.addEventListener('click', () => openModal('signupModal'));
openProfile && openProfile.addEventListener('click', () => { openModal('profileModal'); loadProfile(); });

// Signup
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(e.target).entries());
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.success) {
    closeModal('signupModal');
    showApp();
    updateTokenBadge(data.tokens); // update nav panel directly
  } else {
    alert('Signup failed: ' + (data.error || 'unknown'));
  }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(e.target).entries());
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.success) {
    closeModal('loginModal');
    showApp();
    updateTokenBadge(data.tokens || 0); // update nav panel directly
  } else {
    alert('Login failed: ' + (data.error || 'Invalid credentials'));
  }
});

logoutBtn.addEventListener('click', async () => { await fetch('/api/logout'); location.reload(); });

// On page load, check session
(async () => {
  try {
    const r = await fetch('/api/profile');
    if (r.status === 200) { showApp(); } else { landing.style.display = 'block'; app.style.display = 'none'; }
  } catch (err) { landing.style.display = 'block'; app.style.display = 'none'; }
})();

async function showApp() {
  landing.style.display = 'none';
  app.style.display = 'block';
  initApp();
  loadProfile();
}

// Profile upload & load
// Handle file input change to show preview
if (document.getElementById('fileInput')) {
  document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById('profilePic').src = event.target.result;
      };
      reader.readAsDataURL(file);
      document.getElementById('fileName').textContent = file.name;
    }
  });
}

if (document.getElementById('uploadPicForm')) {
  document.getElementById('uploadPicForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
      alert('Please select a file first');
      return;
    }
    const fd = new FormData(e.target);
    const res = await fetch('/api/upload_profile_pic', { method: 'POST', body: fd });
    const d = await res.json();
    if (d.success) { document.getElementById('profilePic').src = d.profile_pic + '?t=' + Date.now(); loadProfile(); fileInput.value = ''; document.getElementById('fileName').textContent = ''; } else alert('Upload failed: ' + (d.error || 'unknown'));
  });
}

async function loadProfile() {
  const r = await fetch('/api/profile');
  if (r.status !== 200) return;
  const user = await r.json();
  document.getElementById('profilePic').src = user.profile_pic || 'images/avatar-placeholder.svg';
  const info = document.getElementById('profileInfo');
  info.innerHTML = `
    <p><b>Name:</b> ${user.name || ''}</p>
    <p><b>Email:</b> ${user.email || ''}</p>
    <p><b>Age:</b> ${user.age || ''}</p>
    <p><b>Gender:</b> ${user.gender || ''}</p>
    <p><b>Year:</b> ${user.year || ''}</p>
    <p><b>Major:</b> ${user.major || ''}</p>
    <p><b>Stress:</b> ${user.stress || ''}</p>
    <p><b>Sleep:</b> ${user.sleep || ''}</p>
    <p><b>Counseling:</b> ${user.counseling || ''}</p>
    <p><b>Tokens:</b> ${user.tokens || 0}</p>
  `;
  updateTokenBadge(user.tokens);
}

function updateTokenBadge(count) {
  const tokenCount = document.getElementById('token-count'); // nav panel badge
  if (tokenCount) tokenCount.textContent = count || 0;
}

async function refreshTokens() {
  try {
    const res = await fetch('/api/profile'); // assumes token count is part of profile
    if (res.status === 200) {
      const user = await res.json();
      updateTokenBadge(user.tokens);
    }
  } catch (err) {
    console.error('Failed to refresh tokens', err);
  }
}

// Initialize app features
function initApp() {
  initChat();
  initBooking();
  initResources();
  initTherapies();
  initServices();
  initForum();
  initMood();
  document.getElementById('refresh-analytics').addEventListener('click', fetchAnalytics);
}

// Add these near the top of main.js (after DOM elements are grabbed)
const chatBox = document.getElementById('chat-box');

function appendBubble(text, who = 'bot') {
  // who: 'bot' | 'user'
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble ' + (who === 'bot' ? 'bot' : 'user');
  // allow HTML-safe content
  bubble.textContent = text;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
  return bubble;
}

function replaceLastBotBubble(text) {
  const last = chatBox.querySelectorAll('.chat-bubble.bot');
  if (last.length) {
    last[last.length - 1].remove();
  }
  appendBubble(text, 'bot');
}

// Chat
function initChat() {
  document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = document.getElementById('chat-input').value.trim();
    if (!q) return;
    appendBubble(q, 'user');
    document.getElementById('chat-input').value = '';
    appendBubble('...', 'bot');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q })
      });
      const data = await res.json();
      // remove '...'
      const last = chatBox.querySelectorAll('.chat-bubble.bot');
      if (last.length) last[last.length - 1].remove();
      appendBubble(data.reply, 'bot');
    } catch (err) {
      appendBubble('Sorry, something went wrong.', 'bot');
    }
  });
}

// Booking
function initBooking() {
  const form = document.getElementById('booking-form');
  const result = document.getElementById('booking-result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      result.textContent = "❌ Please fill all required fields correctly.";
      result.style.color = "red";
      return;
    }

    const payload = Object.fromEntries(new FormData(form).entries());

    // Proceed with backend call
    try {
      const res = await fetch('/api/book', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const d = await res.json();

      if (d.success) {
        result.textContent = "✅ Appointment booked successfully!";
        result.style.color = "green";
        console.log("Booking Data:", payload);
        form.reset();
      } else {
        result.textContent = '❌ Booking failed: ' + (d.error || 'Unknown error');
        result.style.color = "red";
      }
    } catch (err) {
      result.textContent = '❌ Network error.';
      result.style.color = "red";
    }
  });
}

// Resources
async function initResources() {
  const container = document.getElementById('resources-list');
  const filter = document.getElementById('resource-filter');
  const search = document.getElementById('resource-search');

  if (!container || !filter || !search) return;

  try {
    const res = await fetch('/resources/resources.json', { cache: "no-store" });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const list = await res.json();
    window._resources = list;
    const categories = Array.from(new Set(list.map(r => r.category))).sort();
    filter.innerHTML = '<option value="all">All</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
    renderResources(list);
    filter.addEventListener('change', applyResourceFilters);
    search.addEventListener('input', applyResourceFilters);
  } catch (err) {
    container.innerHTML = `<div style="color:red">Failed to load resources: ${err.message}</div>`;
    console.error("Resources load error:", err);
  }
}

function renderResources(items) {
  const container = document.getElementById('resources-list');
  container.innerHTML = '';
  if (!items.length) {
    container.innerHTML = '<em style="color: var(--muted);">No resources found.</em>';
    return;
  }
  items.forEach(r => {
    const el = document.createElement('div');
    el.className = 'resources_therapies_services_card';
    el.innerHTML = `
      <h2>${r.title}</h2>
      <small style="color: var(--primary-color); font-weight: 600;">Category: ${r.category}</small>
      <p>${r.description}</p>
      <a href="${r.url}" target="_blank" rel="noopener" style="color: var(--secondary-color); text-decoration: none; font-weight: 600; display: inline-block; margin-top: 10px;">Open Resource →</a>
    `;
    container.appendChild(el);
  });
}

function applyResourceFilters() { const cat = document.getElementById('resource-filter').value; const q = (document.getElementById('resource-search').value || '').toLowerCase().trim(); let filtered = window._resources.slice(); if (cat !== 'all') filtered = filtered.filter(r => r.category === cat); if (q) filtered = filtered.filter(r => (r.title + ' ' + r.description).toLowerCase().includes(q)); renderResources(filtered); }

// Therapies
async function initTherapies() {
  const container = document.getElementById('therapies-list');
  const filter = document.getElementById('therapy-filter');
  const search = document.getElementById('therapy-search');

  if (!container || !filter || !search) return;

  try {
    const res = await fetch('/resources/therapies.json', { cache: "no-store" });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const list = await res.json();
    window._therapies = list;
    const categories = Array.from(new Set(list.map(t => t.category))).sort();
    filter.innerHTML =
      '<option value="all">All</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
    renderTherapies(list);
    filter.addEventListener('change', applyTherapyFilters);
    search.addEventListener('input', applyTherapyFilters);
  } catch (err) {
    container.innerHTML = `<div style="color:red">Failed to load therapies: ${err.message}</div>`;
    console.error("Therapies load error:", err);
  }
}

function renderTherapies(items) {
  const container = document.getElementById('therapies-list');
  container.innerHTML = '';
  if (!items.length) {
    container.innerHTML = '<em>No therapies found.</em>';
    return;
  }
  items.forEach(t => {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <h4>${t.title}</h4>
      <small>Category: ${t.category}</small>
      <p>${t.description}</p>
      ${t.url ? `<a href="${t.url}"  rel="noopener">Learn more</a>` : ''}
    `;
    container.appendChild(el);
  });
}

function applyTherapyFilters() {
  const cat = document.getElementById('therapy-filter').value;
  const q = (document.getElementById('therapy-search').value || '').toLowerCase().trim();
  let filtered = window._therapies.slice();
  if (cat !== 'all') filtered = filtered.filter(t => t.category === cat);
  if (q) filtered = filtered.filter(t => (t.title + ' ' + t.description).toLowerCase().includes(q));
  renderTherapies(filtered);
}

// Services
async function initServices() {
  const container = document.getElementById('services-list');
  const filter = document.getElementById('service-filter');
  const search = document.getElementById('service-search');

  if (!container || !filter || !search) return;

  try {
    const res = await fetch('/resources/services.json', { cache: "no-store" });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const list = await res.json();
    window._services = list;
    const categories = Array.from(new Set(list.map(s => s.category))).sort();
    filter.innerHTML =
      '<option value="all">All</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
    renderServices(list);
    filter.addEventListener('change', applyServiceFilters);
    search.addEventListener('input', applyServiceFilters);
  } catch (err) {
    container.innerHTML = `<div style="color:red">Failed to load services: ${err.message}</div>`;
    console.error("Services load error:", err);
  }
}

function renderServices(items) {
  const container = document.getElementById('services-list');
  container.innerHTML = '';
  if (!items.length) {
    container.innerHTML = '<em>No services found.</em>';
    return;
  }
  items.forEach(s => {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <h4>${s.title}</h4>
      <small>Category: ${s.category}</small>
      <p>${s.description}</p>
      ${s.url ? `<a href="${s.url}"  rel="noopener">Learn more</a>` : ''}
    `;
    container.appendChild(el);
  });
}

function applyServiceFilters() {
  const cat = document.getElementById('service-filter').value;
  const q = (document.getElementById('service-search').value || '').toLowerCase().trim();
  let filtered = window._services.slice();
  if (cat !== 'all') filtered = filtered.filter(s => s.category === cat);
  if (q) filtered = filtered.filter(s => (s.title + ' ' + s.description).toLowerCase().includes(q));
  renderServices(filtered);
}

// Forum
async function initForum() {
  document.getElementById('post-form').addEventListener('submit', async (e) => { e.preventDefault(); const payload = Object.fromEntries(new FormData(e.target).entries()); const res = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const d = await res.json(); if (d.success) { alert('Submitted for moderation'); e.target.reset(); loadPosts(); } else alert('Failed to submit'); });
  loadPosts();
}
async function loadPosts() {
  const res = await fetch('/api/posts'); const list = await res.json(); const container = document.getElementById('posts-list'); container.innerHTML = ''; if (!list.length) { container.innerHTML = '<em>No posts yet.</em>'; return; } list.forEach(p => { const el = document.createElement('div'); el.className = 'post'; const likes = p.likes || 0; const comments = p.comments || []; el.innerHTML = `<strong>${p.author}</strong> <small>· ${new Date(p.created_at).toLocaleString()}</small><p>${p.content}</p><div class="post-actions"><button class="like-btn" data-id="${p.id}">👍 ${likes}</button> <button class="toggle-comments" data-id="${p.id}">Comments (${comments.length})</button></div><div class="comments" id="comments-${p.id}" style="display:none;"><div class="comments-list">${comments.map(c => `<div class="comment"><strong>${c.author}</strong> · ${new Date(c.created_at).toLocaleString()}<div>${c.text}</div></div>`).join('')}</div><form class="comment-form" data-id="${p.id}"><input name="author" placeholder="Your name (optional)"/><input name="text" placeholder="Write a comment..." required/><button type="submit">Comment</button></form></div>`; container.appendChild(el); }); // handlers
  container.querySelectorAll('.like-btn').forEach(btn => btn.addEventListener('click', async (e) => { const id = e.target.dataset.id; await fetch(`/api/posts/${id}/like`, { method: 'POST' }); loadPosts(); }));
  container.querySelectorAll('.toggle-comments').forEach(btn => btn.addEventListener('click', (e) => { const id = e.target.dataset.id; const box = document.getElementById('comments-' + id); box.style.display = box.style.display === 'none' ? 'block' : 'none'; }));
  container.querySelectorAll('.comment-form').forEach(form => form.addEventListener('submit', async (e) => { e.preventDefault(); const id = form.dataset.id; const payload = Object.fromEntries(new FormData(form).entries()); const res = await fetch(`/api/posts/${id}/comment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const d = await res.json(); if (d.success) loadPosts(); else alert('Failed to add comment'); }));
}

// Mood + Tips
function initMood() {
  document.getElementById('mood-form').addEventListener('submit', async (e) => { e.preventDefault(); const payload = Object.fromEntries(new FormData(e.target).entries()); const res = await fetch('/api/mood', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const d = await res.json(); if (d.success) { document.getElementById('mood-result').innerText = 'Mood logged.'; e.target.reset(); loadMoodChart(); } else document.getElementById('mood-result').innerText = 'Failed'; });
  document.getElementById('show-chart').addEventListener('click', () => { document.getElementById('chart-container').style.display = 'block'; document.getElementById('show-chart').style.display = 'none'; document.getElementById('hide-chart').style.display = 'inline-block'; loadMoodChart(); });
  document.getElementById('hide-chart').addEventListener('click', () => { document.getElementById('chart-container').style.display = 'none'; document.getElementById('show-chart').style.display = 'inline-block'; document.getElementById('hide-chart').style.display = 'none'; });
  loadDailyTip();
}
async function loadDailyTip() { try { const res = await fetch('/api/tips'); const d = await res.json(); document.getElementById('daily-tip').innerText = d.tip; } catch (err) { document.getElementById('daily-tip').innerText = 'Take a short break.'; } }
async function loadMoodChart() { const res = await fetch('/api/mood'); const list = await res.json(); if (!Array.isArray(list) || list.length === 0) { document.getElementById('mood-result').innerText = 'No entries yet.'; return; } const items = list.slice(-30); const labels = items.map(i => new Date(i.created_at).toLocaleDateString()); const data = items.map(i => i.mood); renderMoodChart(labels, data); }
let moodChart = null;
function renderMoodChart(labels, data) { if (moodChart) { moodChart.data.labels = labels; moodChart.data.datasets[0].data = data; moodChart.update(); return; } const ctx = document.getElementById('mood-chart').getContext('2d'); moodChart = new Chart(ctx, { type: 'line', data: { labels: labels, datasets: [{ label: 'Mood', data: data, tension: 0.35, fill: true, pointRadius: 6, borderWidth: 2 }] }, options: { scales: { y: { min: 1, max: 5, ticks: { stepSize: 1 } } }, plugins: { legend: { display: false } } } }); }

// Admin analytics & moderation
async function fetchAnalytics() { const res = await fetch('/api/admin/analytics'); const data = await res.json(); document.getElementById('analytics-output').innerText = JSON.stringify(data, null, 2); const mp = await fetch('/api/admin/pending'); const pending = await mp.json(); const container = document.getElementById('pending-posts'); container.innerHTML = ''; pending.forEach(p => { const el = document.createElement('div'); el.className = 'post'; el.innerHTML = `<strong>${p.author}</strong> <small>· ${new Date(p.created_at).toLocaleString()}</small><p>${p.content}</p><button data-id="${p.id}" class="approve-btn">Approve</button> <button data-id="${p.id}" class="delete-btn">Delete</button>`; container.appendChild(el); }); container.querySelectorAll('.approve-btn').forEach(btn => btn.addEventListener('click', async (e) => { const id = e.target.dataset.id; const res = await fetch('/api/admin/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); const d = await res.json(); if (d.success) fetchAnalytics(); else alert('Failed'); })); container.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', async (e) => { const id = e.target.dataset.id; const res = await fetch('/api/admin/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); const d = await res.json(); if (d.success) fetchAnalytics(); else alert('Failed'); })); }

// Language switcher
document.getElementById("languageSelect").addEventListener("change", (e) => {
  applyTranslations(e.target.value);
});

// Load preferred language on startup
const savedLang = localStorage.getItem("lang") || "en";
document.getElementById("languageSelect").value = savedLang;
applyTranslations(savedLang);
