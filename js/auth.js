import { supabase } from '/natpass/js/supabase.js';

export async function login(email, password) {
  try {
    sessionStorage.removeItem('masterPassword');
    
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });
      if (signUpError) throw signUpError;
      return { needsConfirmation: true };
    }

    sessionStorage.setItem('masterPassword', password);
    return data;
  } catch (error) {
    sessionStorage.removeItem('masterPassword');
    throw error;
  }
}

export async function logout() {
  try {
    sessionStorage.removeItem('masterPassword');
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export function getMasterPassword() {
  return sessionStorage.getItem('masterPassword');
}