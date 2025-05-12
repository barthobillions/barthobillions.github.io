import { supabase } from '/natpass/js/supabase.js';

export async function login(email, password) {
  if (!email || !password) {
    throw new Error("Please enter a valid email and password.");
  }

  // Store password in sessionStorage for credential encryption/decryption
  sessionStorage.setItem('masterPassword', password);

  const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    sessionStorage.removeItem('masterPassword');
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) throw signUpError;
    return { needsConfirmation: true };
  }

  return data;
}

export async function logout() {
  sessionStorage.removeItem('masterPassword');
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return data?.user || null;
}

export function getMasterPassword() {
  return sessionStorage.getItem('masterPassword');
}