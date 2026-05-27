/* ─────────────────────────────────────────── PAGE ROUTER ─────────────────────────────────────────── */
let currentPage = 'main';
let selectedDonationAmount = 500;

function showPage(id) {
  document.querySelectorAll('.page, #main-site').forEach(el => el.classList.remove('active'));
  const target = id === 'main' ? document.getElementById('main-site') : document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({top:0, behavior:'instant'});
  }
  // Close donate modal if open
  document.getElementById('donate-modal').classList.remove('open');
  document.body.style.overflow = '';
  currentPage = id;
}

// Inject footer into every subpage that doesn't already have one
document.addEventListener('DOMContentLoaded', () => {
  const footerHTML = `<footer>
    <div class="footer-top">
      <div class="footer-brand">
        <div class="footer-logo">
          <div class="icon" style="width:36px;height:36px;background:var(--orange);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px">♥</div>
          <div><div class="name">She Can</div><span class="sub">FOUNDATION</span></div>
        </div>
        <p>A non-profit organization empowering women and uplifting communities across India through education, dignity and opportunity.</p>
        <div class="footer-reg">REGISTERED · INDIAN SOCIETY ACT, 1860</div>
        <div class="footer-social">
          <div class="social-icon">📸</div>
          <div class="social-icon">🐦</div>
          <div class="social-icon">💼</div>
          <div class="social-icon">📘</div>
        </div>
      </div>
      <div class="footer-col">
        <h4>EXPLORE</h4>
        <ul>
          <li><a onclick="showPage('main');smoothTo('home')">Home</a></li>
          <li><a onclick="showPage('main');smoothTo('about')">About</a></li>
          <li><a onclick="showPage('main');smoothTo('programs')">Programs</a></li>
          <li><a onclick="showPage('main');smoothTo('campaign')">Campaign</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>ENGAGE</h4>
        <ul>
          <li><a onclick="openDonateModal()">Donate</a></li>
          <li><a onclick="showPage('volunteer')">Volunteer</a></li>
          <li><a onclick="showPage('intern')">Intern</a></li>
          <li><a onclick="showPage('partner')">Partner</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>RESOURCES</h4>
        <ul>
          <li><a onclick="showPage('annual-report')">Annual Report</a></li>
          <li><a onclick="showPage('press')">Press</a></li>
          <li><a onclick="showPage('stories')">Stories</a></li>
          <li><a onclick="showPage('main');smoothTo('contact')">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 She Can Foundation. All rights reserved.</p>
      <span class="admin-link" onclick="openAdminPanel()">Admin</span>
      <div class="made-with">Made with <span>♥</span> in India</div>
    </div>
  </footer>`;

  // Add footer to all subpages
  document.querySelectorAll('.subpage').forEach(page => {
    if (!page.querySelector('footer')) {
      page.insertAdjacentHTML('beforeend', footerHTML);
    }
  });
});

function smoothTo(sectionId) {
  setTimeout(() => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({behavior:'smooth'});
  }, 50);
}

// Nav logo back to main
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
  });
});

// Intersection observer for animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.prog-card,.join-card,.contact-card,.donation-card,.impact-card,.donate-tier,.role-card,.resource-card,.story-card,.partner-tier,.prog-stat-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});

/* ─────────────────────────────────────────── DONATION ─────────────────────────────────────────── */
function selectDonation(el, amount) {
  document.querySelectorAll('.donation-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  selectedDonationAmount = amount;
}

function openDonateModal() {
  const m = document.getElementById('donate-modal');
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDonateModal() {
  const m = document.getElementById('donate-modal');
  m.classList.remove('open');
  document.body.style.overflow = '';
  // Reset form after short delay
  setTimeout(() => {
    document.getElementById('donate-form-body').style.display = 'block';
    document.getElementById('donate-form-success').style.display = 'none';
    const btn = document.getElementById('donate-submit');
    if (btn) { btn.disabled = false; btn.textContent = '♥ Confirm Donation'; }
  }, 400);
}
// Close on backdrop click
document.getElementById('donate-modal').addEventListener('click', function(e) {
  if (e.target === this) closeDonateModal();
});

function setDonationTier(el, amount) {
  document.querySelectorAll('.donate-tier').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('donate-amount').value = amount;
}
function setPayMethod(el) {
  document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('active'));
  el.classList.add('active');
  const upi = document.getElementById('upi-block');
  upi.style.display = el.textContent.includes('UPI') ? 'block' : 'none';
}

async function submitDonation() {
  const name = document.getElementById('donate-name').value.trim();
  const email = document.getElementById('donate-email').value.trim();
  const amount = document.getElementById('donate-amount').value;
  const errEl = document.getElementById('donate-err');
  errEl.style.display = 'none';

  if (!name || !email || !amount) { errEl.textContent = 'Please fill in name, email and amount.'; errEl.style.display = 'block'; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errEl.textContent = 'Please enter a valid email.'; errEl.style.display = 'block'; return; }

  const btn = document.getElementById('donate-submit');
  btn.disabled = true; btn.textContent = 'Processing…';

  try {
    const { collection, addDoc, serverTimestamp } = window.__fbModules;
    await addDoc(collection(window.__db, 'donations'), {
      name, email,
      phone: document.getElementById('donate-phone').value.trim(),
      amount: parseFloat(amount),
      cause: document.getElementById('donate-cause').value,
      submittedAt: serverTimestamp()
    });
    document.getElementById('donate-form-body').style.display = 'none';
    document.getElementById('donate-form-success').style.display = 'block';
  } catch(err) {
    errEl.textContent = 'Something went wrong. Please try again.';
    errEl.style.display = 'block';
  }
  btn.disabled = false; btn.textContent = '♥ Confirm Donation';
}

/* ─────────────────────────────────────────── CONTACT FORM ─────────────────────────────────────────── */
async function submitContactForm() {
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const message = document.getElementById('cf-msg').value.trim();
  let valid = true;
  ['name','email','msg'].forEach(f => document.getElementById('err-'+f).style.display='none');
  document.getElementById('form-error').style.display='none';
  if (!name) { document.getElementById('err-name').style.display='block'; valid=false; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('err-email').style.display='block'; valid=false; }
  if (!message) { document.getElementById('err-msg').style.display='block'; valid=false; }
  if (!valid) return;
  const btn = document.getElementById('cf-submit');
  btn.disabled = true; btn.textContent = 'Sending…';
  try {
    const { collection, addDoc, serverTimestamp } = window.__fbModules;
    await addDoc(collection(window.__db, 'contact_submissions'), { name, email, message, submittedAt: serverTimestamp() });
    document.getElementById('form-fields').style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  } catch(err) {
    document.getElementById('form-error').textContent = 'Something went wrong. Please try again.';
    document.getElementById('form-error').style.display = 'block';
    btn.disabled = false; btn.textContent = '♥ Send Message';
  }
}

/* ─────────────────────────────────────────── VOLUNTEER FORM ─────────────────────────────────────────── */
async function submitVolunteer() {
  const name = document.getElementById('vol-name').value.trim();
  const email = document.getElementById('vol-email').value.trim();
  const errEl = document.getElementById('vol-err');
  errEl.style.display = 'none';
  if (!name || !email) { errEl.textContent = 'Name and email are required.'; errEl.style.display = 'block'; return; }
  try {
    const { collection, addDoc, serverTimestamp } = window.__fbModules;
    await addDoc(collection(window.__db, 'volunteer_applications'), {
      name, email,
      phone: document.getElementById('vol-phone').value.trim(),
      city: document.getElementById('vol-city').value.trim(),
      role: document.getElementById('vol-role').value,
      why: document.getElementById('vol-why').value.trim(),
      submittedAt: serverTimestamp()
    });
    document.getElementById('vol-form').style.display = 'none';
    document.getElementById('vol-success').style.display = 'block';
  } catch(e) { errEl.textContent = 'Error: ' + e.message; errEl.style.display = 'block'; }
}

/* ─────────────────────────────────────────── INTERN FORM ─────────────────────────────────────────── */
async function submitIntern() {
  const name = document.getElementById('int-name').value.trim();
  const email = document.getElementById('int-email').value.trim();
  const errEl = document.getElementById('int-err');
  errEl.style.display = 'none';
  if (!name || !email) { errEl.textContent = 'Name and email are required.'; errEl.style.display = 'block'; return; }
  try {
    const { collection, addDoc, serverTimestamp } = window.__fbModules;
    await addDoc(collection(window.__db, 'intern_applications'), {
      name, email,
      college: document.getElementById('int-college').value.trim(),
      course: document.getElementById('int-course').value.trim(),
      dept: document.getElementById('int-dept').value,
      start: document.getElementById('int-start').value,
      why: document.getElementById('int-why').value.trim(),
      submittedAt: serverTimestamp()
    });
    document.getElementById('intern-form').style.display = 'none';
    document.getElementById('intern-success').style.display = 'block';
  } catch(e) { errEl.textContent = 'Error: ' + e.message; errEl.style.display = 'block'; }
}

/* ─────────────────────────────────────────── SKILLS FORM ─────────────────────────────────────────── */
async function submitSkills() {
  const name = document.getElementById('sk-name').value.trim();
  const email = document.getElementById('sk-email').value.trim();
  const errEl = document.getElementById('sk-err');
  errEl.style.display = 'none';
  if (!name || !email) { errEl.textContent = 'Name and email are required.'; errEl.style.display = 'block'; return; }
  try {
    const { collection, addDoc, serverTimestamp } = window.__fbModules;
    await addDoc(collection(window.__db, 'skills_contributions'), {
      name, email,
      skill: document.getElementById('sk-skill').value.trim(),
      portfolio: document.getElementById('sk-portfolio').value.trim(),
      message: document.getElementById('sk-msg').value.trim(),
      submittedAt: serverTimestamp()
    });
    document.getElementById('skills-form').style.display = 'none';
    document.getElementById('skills-success').style.display = 'block';
  } catch(e) { errEl.textContent = 'Error: ' + e.message; errEl.style.display = 'block'; }
}

/* ─────────────────────────────────────────── PARTNER FORM ─────────────────────────────────────────── */
async function submitPartner() {
  const name = document.getElementById('pt-name').value.trim();
  const email = document.getElementById('pt-email').value.trim();
  const company = document.getElementById('pt-company').value.trim();
  const errEl = document.getElementById('pt-err');
  errEl.style.display = 'none';
  if (!name || !email || !company) { errEl.textContent = 'Name, company and email are required.'; errEl.style.display = 'block'; return; }
  try {
    const { collection, addDoc, serverTimestamp } = window.__fbModules;
    await addDoc(collection(window.__db, 'partner_enquiries'), {
      name, email, company,
      phone: document.getElementById('pt-phone').value.trim(),
      type: document.getElementById('pt-type').value,
      message: document.getElementById('pt-msg').value.trim(),
      submittedAt: serverTimestamp()
    });
    document.getElementById('partner-form').style.display = 'none';
    document.getElementById('partner-success').style.display = 'block';
  } catch(e) { errEl.textContent = 'Error: ' + e.message; errEl.style.display = 'block'; }
}


/* ─────────────────────────────────────────── ADMIN PANEL ─────────────────────────────────────────── */
function openAdminPanel() {
  document.getElementById('admin-panel').style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closeAdminPanel() {
  document.getElementById('admin-panel').style.display = 'none';
  document.body.style.overflow = '';
}

// Keyboard shortcut
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') openAdminPanel();
  if (e.key === 'Escape') { closeAdminPanel(); closeDonateModal(); }
});

async function adminLogin() {
  const email = document.getElementById('admin-email').value.trim();
  const pass = document.getElementById('admin-pass').value;
  const errEl = document.getElementById('admin-login-err');
  errEl.style.display = 'none';
  try {
    const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    const cred = await signInWithEmailAndPassword(window.__auth, email, pass);
    showAdminDashboard(cred.user);
  } catch(err) {
    errEl.textContent = 'Login failed: ' + err.message;
    errEl.style.display = 'block';
  }
}

function showAdminDashboard(user) {
  document.getElementById('admin-login-screen').style.display = 'none';
  document.getElementById('admin-dashboard').style.display = 'block';
  document.getElementById('admin-user-label').textContent = user.email;
  document.getElementById('admin-user-chip-email').textContent = user.email;
  loadAllStats();
  loadCollection('contact_submissions','messages-table','messages');
}

async function adminSignOut() {
  const { signOut } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
  await signOut(window.__auth);
  document.getElementById('admin-login-screen').style.display = 'flex';
  document.getElementById('admin-dashboard').style.display = 'none';
  document.getElementById('admin-email').value = '';
  document.getElementById('admin-pass').value = '';
}

function adminNav(el, sectionId) {
  document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById(sectionId);
  if (section) section.classList.add('active');
  document.getElementById('admin-page-title').textContent = el.textContent.trim();
  // Auto-load section data
  const loaders = {
    'dash-messages': () => loadCollection('contact_submissions','messages-table','messages'),
    'dash-volunteers': () => loadCollection('volunteer_applications','volunteers-table','volunteers'),
    'dash-interns': () => loadCollection('intern_applications','interns-table','interns'),
    'dash-donations': () => loadCollection('donations','donations-table','donations'),
    'dash-partners': () => loadCollection('partner_enquiries','partners-table','partners'),
    'dash-skills': () => loadCollection('skills_contributions','skills-table','skills'),
  };
  if (loaders[sectionId]) loaders[sectionId]();
}

async function loadAllStats() {
  const collections = [
    ['contact_submissions','stat-messages'],
    ['volunteer_applications','stat-volunteers'],
    ['intern_applications','stat-interns'],
    ['donations','stat-donations'],
    ['partner_enquiries','stat-partners'],
    ['skills_contributions','stat-skills'],
  ];
  for (const [col, statId] of collections) {
    try {
      const { collection, getDocs } = window.__fbModules;
      const snap = await getDocs(collection(window.__db, col));
      const el = document.getElementById(statId);
      if (el) el.textContent = snap.size;
    } catch(e) {
      const el = document.getElementById(statId);
      if (el) el.textContent = '—';
    }
  }
}

const colConfig = {
  messages: { headers: ['Name','Email','Message','Date','Actions'], fields: ['name','email','message','submittedAt'] },
  volunteers: { headers: ['Name','Email','Role','City','Date','Actions'], fields: ['name','email','role','city','submittedAt'] },
  interns: { headers: ['Name','Email','College','Dept.','Date','Actions'], fields: ['name','email','college','dept','submittedAt'] },
  donations: { headers: ['Name','Email','Amount','Cause','Date','Actions'], fields: ['name','email','amount','cause','submittedAt'] },
  partners: { headers: ['Contact','Company','Type','Email','Date','Actions'], fields: ['name','company','type','email','submittedAt'] },
  skills: { headers: ['Name','Email','Skill Area','Portfolio','Date','Actions'], fields: ['name','email','skill','portfolio','submittedAt'] },
};

async function loadCollection(colName, targetId, type) {
  const container = document.getElementById(targetId);
  container.innerHTML = '<div class="admin-empty">Loading…</div>';
  try {
    const { collection, getDocs, query, orderBy } = window.__fbModules;
    const q = query(collection(window.__db, colName), orderBy('submittedAt','desc'));
    const snap = await getDocs(q);
    if (snap.empty) { container.innerHTML = '<div class="admin-empty">No records yet.</div>'; return; }
    const cfg = colConfig[type];
    let html = '<table class="admin-table"><thead><tr>' + cfg.headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';
    snap.forEach(docSnap => {
      const d = docSnap.data();
      const date = d.submittedAt?.toDate ? d.submittedAt.toDate().toLocaleDateString('en-IN') : '—';
      html += '<tr>' + cfg.fields.map((f,i) => {
        let val = d[f] ?? '—';
        if (f === 'submittedAt') val = date;
        if (f === 'amount') val = '₹' + (val === '—' ? '—' : Number(val).toLocaleString('en-IN'));
        if (f === 'message' && val.length > 60) val = val.substring(0,60) + '…';
        return `<td style="font-size:13px;">${val}</td>`;
      }).join('');
      html += `<td><button class="del-btn" onclick="deleteEntry('${colName}','${docSnap.id}','${targetId}','${type}')">Delete</button></td></tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
    addActivity(`Loaded ${snap.size} ${type}`);
  } catch(e) {
    container.innerHTML = `<div class="admin-empty" style="color:#f87171;">Error: ${e.message}</div>`;
  }
}

async function deleteEntry(colName, docId, targetId, type) {
  if (!confirm('Delete this entry?')) return;
  try {
    const { doc, deleteDoc } = window.__fbModules;
    await deleteDoc(doc(window.__db, colName, docId));
    loadCollection(colName, targetId, type);
    addActivity(`Deleted entry from ${colName}`);
  } catch(e) { alert('Delete failed: ' + e.message); }
}

function addActivity(text) {
  const feed = document.getElementById('activity-feed');
  if (!feed) return;
  const item = document.createElement('div');
  item.className = 'activity-item';
  item.innerHTML = `<div class="activity-dot"></div><div><div class="activity-text">${text}</div><div class="activity-time">${new Date().toLocaleTimeString('en-IN')}</div></div>`;
  feed.insertBefore(item, feed.firstChild);
  if (feed.children.length > 20) feed.removeChild(feed.lastChild);
}
