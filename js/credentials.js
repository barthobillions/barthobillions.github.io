import { supabase } from '/natpass/js/supabase.js';
import { getKeyFromPassword, encryptData, decryptData } from '/natpass/js/encryption.js';
import { getMasterPassword } from '/natpass/js/auth.js';

export async function saveCredential(name, site, username, password) {
  try {
    const masterPassword = getMasterPassword();
    if (!masterPassword) throw new Error('Authentication required');

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('User not authenticated');

    const key = await getKeyFromPassword(masterPassword);
    const encryptedPassword = await encryptData(key, password);

    const { data, error } = await supabase.from('credentials')
      .insert({
        user_id: user.id,
        name,
        site_name: site,
        account_name: username,
        password: encryptedPassword
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Save credential error:', error);
    throw new Error('Failed to save credential');
  }
}

export async function loadCredentials() {
  try {
    const masterPassword = getMasterPassword();
    if (!masterPassword) throw new Error('Authentication required');

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('User not authenticated');

    const { data, error } = await supabase.from('credentials')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return [];

    const key = await getKeyFromPassword(masterPassword);
    return await Promise.all(data.map(async cred => {
      try {
        const decrypted = await decryptData(key, cred.password);
        return {
          ...cred,
          password_decrypted: decrypted,
          account_username: cred.account_name
        };
      } catch (e) {
        return {
          ...cred,
          password_decrypted: null,
          account_username: cred.account_name
        };
      }
    }));
  } catch (error) {
    console.error('Load credentials error:', error);
    throw error;
  }
}

export async function deleteCredential(id) {
  try {
    const { error } = await supabase.from('credentials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Delete credential error:', error);
    throw error;
  }
}
