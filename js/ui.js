export function toggleElement(elementId, buttonId) {
  const element = document.getElementById(elementId);
  element.classList.toggle('hidden');
  
  if (buttonId) {
    const button = document.getElementById(buttonId);
    button.textContent = element.classList.contains('hidden') 
      ? 'Add New Credential' 
      : 'Cancel';
  }
}

export function createCredentialElement(credential, showPassword = false) {
  const li = document.createElement('li');
  li.className = 'credential-item';
  
  const passwordDisplay = showPassword 
    ? credential.password_decrypted 
    : '*'.repeat(10);
  
  li.innerHTML = `
    <div class="credential-header">
      <h3>${credential.name}</h3>
      <span class="site-name">${credential.site_name}</span>
    </div>
    <div class="credential-details">
      <span class="username">${credential.account_username}</span>
      <div class="password-container">
        <span class="password-display">${passwordDisplay}</span>
        <button class="toggle-password" data-id="${credential.id}">
          ${showPassword ? 'Hide' : 'Show'}
        </button>
        <button class="delete-credential" data-id="${credential.id}">Delete</button>
      </div>
    </div>
  `;
  
  return li;
}

export function renderCredentials(credentials, container) {
  container.innerHTML = '';
  
  const list = document.createElement('ul');
  credentials.forEach(cred => {
    list.appendChild(createCredentialElement(cred));
  });
  
  container.appendChild(list);
}