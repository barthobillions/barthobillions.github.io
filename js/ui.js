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

export function createCredentialElement(credential) {
    const li = document.createElement('li');
    li.className = 'credential-item';
    
    li.innerHTML = `
        <div class="credential-header">
            <h3>${credential.name}</h3>
            <span class="site-name">${credential.site_name}</span>
        </div>
        <div class="credential-details">
            <span class="username">${credential.account_username}</span>
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
    container.innerHTML = '';
    
    if (!credentials.length) {
        container.innerHTML = '<p class="empty-state">No credentials saved yet</p>';
        return;
    }

    const list = document.createElement('ul');
    credentials.forEach(cred => {
        list.appendChild(createCredentialElement(cred));
    });
    container.appendChild(list);
}