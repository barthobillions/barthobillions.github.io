import { supabase } from '/natpass/js/supabase.js';
import { getKeyFromPassword, encryptData, decryptData } from '/natpass/js/encryption.js';

export async function saveCredential(site, username, password, masterPassword) {
  const { data: user } = await supabase.auth.getUser();
  if (!user) throw new Error("User not logged in.");

  const key = await getKeyFromPassword(masterPassword);
  const encrypted = await encryptData(key, password);

  const { data, error } = await supabase.from('credentials').insert({
    user_id: user.id,
    site_name: site,
    account_username: username,
    password_encrypted: encrypted
  }).select();

  if (error) throw error;
  return data;
}

export async function loadCredentials(masterPassword) {
  const { data: user } = await supabase.auth.getUser();
  if (!user) throw new Error("User not logged in.");

  const { data, error } = await supabase.from('credentials')
    .select('*')
    .eq('user_id', user.id)
    .order('site_name');

  if (error) throw error;

  if (masterPassword) {
    const key = await getKeyFromPassword(masterPassword);
    for (const cred of data) {
      try {
        cred.password_decrypted = await decryptData(key, cred.password_encrypted);
      } catch (err) {
        console.error("Failed to decrypt password:", err);
        cred.password_decrypted = "Decryption failed";
      }
    }
  }

  return data;
}

export async function deleteCredential(id) {
  const { error } = await supabase.from('credentials').delete().eq('id', id);
  if (error) throw error;
}