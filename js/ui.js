export function toggleElement(elementId, buttonId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.classList.toggle('hidden');

  if (buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.textContent = element.classList.contains('hidden') 
        ? 'Add New Credential' 
        : 'Cancel';
    }
  }
}

export function createCredentialElement(credential) {
  const li = document.createElement('li');
  li.className = 'credential-item';
  li.dataset.id = credential.id;
  
  li.innerHTML = `
    <div class="credential-header">
      <h3>${credential.name || 'Unnamed'}</h3>
      <span class="site-name">${credential.site_name || 'No site'}</span>
    </div>
    <div class="credential-details">
      <span class="username">${credential.account_username || 'No username'}</span>
      <div class="password-container">
        <span class="password-display">${'*'.repeat(10)}</span>
        <button class="toggle-password" data-id="${credential.id}">Show</button>
        <button class="delete-credential" data-id="${credential.id}">Delete</button>
      </div>
    </div>
  `;
  
  return li;
}

export function renderCredentials(credentials, container) {
  if (!container) return;

  container.innerHTML = '';

  if (!credentials || credentials.length === 0) {
    container.innerHTML = '<p class="empty-state">No credentials saved yet</p>';
    return;
  }

  const list = document.createElement('ul');
  list.className = 'credentials-list';

  credentials.forEach(cred => {
    list.appendChild(createCredentialElement(cred));
  });

  container.appendChild(list);
}