import { supabase } from '/natpass/supabase.js';

/**
 * Handles user login with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - User data or error
 */
export async function login(email, password) {
  if (!email || !password) {
    throw new Error("Please enter a valid email and password.");
  }

  // Try to sign in first
  const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    // If sign-in fails, try sign-up
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      throw new Error(`Sign in/up failed: ${signUpError.message}`);
    }
    return { needsConfirmation: true };
  }

  return data;
}

/**
 * Handles user signup
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Signup result
 */
export async function signup(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Logs out the current user
 * @returns {Promise<void>}
 */
export async function logout() {
  await supabase.auth.signOut();
}

/**
 * Gets the current authenticated user
 * @returns {Promise<Object|null>} - Current user or null if not authenticated
 */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}