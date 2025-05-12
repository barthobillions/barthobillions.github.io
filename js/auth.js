import { supabase } from '/natpass/js/supabase.js';

export async function login(email, password) {
    // Try to sign in first
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (signInError) {
        // If sign-in fails, try to sign up
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password
        });
        if (signUpError) throw signUpError;
        return { needsConfirmation: true };
    }

    // Store password for credential encryption
    sessionStorage.setItem('masterPassword', password);
    return data;
}

export async function logout() {
    sessionStorage.removeItem('masterPassword');
    await supabase.auth.signOut();
}

export async function getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
}

export function getMasterPassword() {
    return sessionStorage.getItem('masterPassword');
}