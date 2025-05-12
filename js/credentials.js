import { supabase } from './supabase.js';
import { getKeyFromPassword, encryptData, decryptData } from './encryption.js';

/**
 * Saves a new credential for the current user
 * @param {string} site - Website/service name
 * @param {string} username - Username/email for the site
 * @param {string} password - Password for the site
 * @param {string} masterPassword - User's master password for encryption
 * @returns {Promise<Object>} - Saved credential data
 */
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

/**
 * Loads all credentials for the current user
 * @param {string} masterPassword - User's master password for decryption
 * @returns {Promise<Array>} - Array of credential objects
 */
export async function loadCredentials(masterPassword) {
  const { data: user } = await supabase.auth.getUser();
  if (!user) throw new Error("User not logged in.");

  const { data, error } = await supabase.from('credentials')
    .select('*')
    .eq('user_id', user.id)
    .order('site_name');

  if (error) throw error;

  // Decrypt passwords if masterPassword is provided
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

/**
 * Deletes a credential by ID
 * @param {string} id - Credential ID to delete
 * @returns {Promise<void>}
 */
export async function deleteCredential(id) {
  const { error } = await supabase.from('credentials').delete().eq('id', id);
  if (error) throw error;
}