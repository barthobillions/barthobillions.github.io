import { supabase } from '/natpass/js/supabase.js';

export async function login(email, password) {
  if (!email || !password) {
    throw new Error("Please enter a valid email and password.");
  }

  const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      throw new Error(`Sign in/up failed: ${signUpError.message}`);
    }
    return { needsConfirmation: true };
  }

  return data;
}

export async function signup(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}