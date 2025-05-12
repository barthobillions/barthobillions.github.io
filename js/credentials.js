import { supabase } from '/natpass/js/supabase.js';
import { getKeyFromPassword, encryptData, decryptData } from '/natpass/js/encryption.js';
import { getMasterPassword } from '/natpass/js/auth.js';

export async function saveCredential(name, site, username, password) {
    const masterPassword = getMasterPassword();
    const { data: user } = await supabase.auth.getUser();
    
    const key = await getKeyFromPassword(masterPassword);
    const encrypted = await encryptData(key, password);

    const { data, error } = await supabase.from('credentials')
        .insert({
            user_id: user.user.id,
            name: name,
            site_name: site,
            account_name: username,
            password: encrypted
        })
        .select();

    if (error) throw error;
    return data[0];
}

export async function loadCredentials() {
    const masterPassword = getMasterPassword();
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase.from('credentials')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data.length) return [];

    const key = await getKeyFromPassword(masterPassword);
    return Promise.all(data.map(async cred => {
        try {
            const decrypted = await decryptData(key, cred.password);
            return {
                ...cred,
                password_decrypted: decrypted,
                account_username: cred.account_name
            };
        } catch {
            return { ...cred, password_decrypted: null };
        }
    }));
}

export async function deleteCredential(id) {
    const { error } = await supabase.from('credentials')
        .delete()
        .eq('id', id);
    if (error) throw error;
}