/**
 * Toggles visibility of an element by ID
 * @param {string} elementId - ID of the element to toggle
 * @param {string} [buttonId] - Optional button ID to update text
 */
export function toggleElement(elementId, buttonId) {
  const element = document.getElementById(elementId);
  element.classList.toggle('hidden');
  
  if (buttonId) {
    const button = document.getElementById(buttonId);
    button.textContent = element.classList.contains('hidden') 
      ? button.textContent.replace('Hide', 'Show') 
      : button.textContent.replace('Show', 'Hide');
  }
}

/**
 * Creates a credential list item HTML element
 * @param {Object} credential - Credential data
 * @param {boolean} [showPassword=false] - Whether to show the password
 * @returns {HTMLElement} - List item element
 */
export function createCredentialElement(credential, showPassword = false) {
  const li = document.createElement('li');
  li.className = 'credential-item';
  
  const passwordDisplay = showPassword 
    ? credential.password_decrypted 
    : '*'.repeat(10);
  
  li.innerHTML = `
    <div class="credential-header">
      <span class="site-name">${credential.site_name}</span>
      <span class="username">${credential.account_username}</span>
    </div>
    <div class="password-container">
      <span class="password-display">${passwordDisplay}</span>
      <button class="toggle-password" data-id="${credential.id}">
        ${showPassword ? 'Hide' : 'Show'}
      </button>
      <button class="delete-credential" data-id="${credential.id}">Delete</button>
    </div>
  `;
  
  return li;
}

/**
 * Renders a list of credentials grouped by site
 * @param {Array} credentials - Array of credential objects
 * @param {HTMLElement} container - Container element to render into
 */
export function renderCredentials(credentials, container) {
  container.innerHTML = '';
  
  // Group by site
  const grouped = credentials.reduce((acc, cred) => {
    if (!acc[cred.site_name]) acc[cred.site_name] = [];
    acc[cred.site_name].push(cred);
    return acc;
  }, {});
  
  // Create elements for each group
  for (const [site, siteCreds] of Object.entries(grouped)) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'credential-group';
    groupDiv.innerHTML = `<h3>${site}</h3>`;
    
    const list = document.createElement('ul');
    siteCreds.forEach(cred => {
      list.appendChild(createCredentialElement(cred));
    });
    
    groupDiv.appendChild(list);
    container.appendChild(groupDiv);
  }
}