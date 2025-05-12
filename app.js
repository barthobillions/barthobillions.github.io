// ===== CONFIG =====
const SUPABASE_URL = 'https://xyjyhwojxrqugnlbqmoz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5anlod29qeHJxdWdubGJxbW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDI3NTYsImV4cCI6MjA2MjU3ODc1Nn0.AxKNG5LS3zRLEpwBBdJFENnrP_Gu7bb3BZg-99aRl5I';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== ELEMENTS =====
const loginBtn = document.getElementById('login');
const saveBtn = document.getElementById('save-password');
const authDiv = document.getElementById('auth');
const dashboardDiv = document.getElementById('dashboard');

// ===== AUTHENTICATION =====
loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert("Please enter a valid email and password.");
    return;
  }

  // Try to sign in first
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    // If sign-in fails, try sign-up
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      console.error('❌ Auth failed:', signUpError.message);
      alert("Sign in / Sign up failed. Please check your credentials.");
      return;
    } else {
      alert("Account created. Please check your email to confirm before logging in.");
      return;
    }
  }

  // Auth succeeded
  authDiv.classList.add('hidden');
  dashboardDiv.classList.remove('hidden');
  loadPasswords();
});

// ===== ENCRYPTION =====
async function getKeyFromPassword(password) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('static-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptData(key, data) {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(data)
  );
  const combined = new Uint8Array([...iv, ...new Uint8Array(ciphertext)]);
  return btoa(String.fromCharCode(...combined));
}

// ===== SAVE PASSWORD =====
saveBtn.addEventListener('click', async () => {
  const site = document.getElementById('site-name').value;
  const username = document.getElementById('account-username').value;
  const password = document.getElementById('site-password').value;
  const master = document.getElementById('master-password').value;

  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;
  if (!user) {
    alert("User not logged in.");
    return;
  }

  const key = await getKeyFromPassword(master);
  const encrypted = await encryptData(key, password);

  await supabase.from('credentials').insert({
    user_id: user.id,
    site_name: site,
    account_username: username,
    password_encrypted: encrypted
  });

  loadPasswords();
});

// ===== LOAD PASSWORDS =====
async function loadPasswords() {
  const { data, error } = await supabase.from('credentials').select('*').order('site_name');
  if (error) {
    console.error("Failed to load credentials:", error.message);
    return;
  }

  const list = document.getElementById('password-list');
  list.innerHTML = '';

  const grouped = {};
  data.forEach(row => {
    if (!grouped[row.site_name]) grouped[row.site_name] = [];
    grouped[row.site_name].push(row);
  });

  for (const site in grouped) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${site}</strong>`;
    const ul = document.createElement('ul');

    grouped[site].forEach(entry => {
      const entryLi = document.createElement('li');
      entryLi.textContent = `${entry.account_username}`;
      ul.appendChild(entryLi);
    });

    li.appendChild(ul);
    list.appendChild(li);
  }
}

// ===== INITIAL CONNECTION TEST =====
(async () => {
  const { data, error } = await supabase.from('credentials').select('*').limit(1);
  if (error) {
    console.error('❌ Supabase connection failed:', error.message);
  } else {
    console.log('✅ Supabase connected! Sample data:', data);
  }
})();
