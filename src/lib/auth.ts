import { supabase } from "@/integrations/supabase/client";

// Username-based auth: we map each username to a deterministic internal email
// so we can use Supabase's secure email/password auth under the hood.
const EMAIL_DOMAIN = "users.garena.local";

export function usernameToEmail(username: string) {
  return `${username.trim().toLowerCase()}@${EMAIL_DOMAIN}`;
}

export async function signUpWithUsername(username: string, password: string) {
  const email = usernameToEmail(username);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: username.trim() },
      emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithUsername(username: string, password: string) {
  const email = usernameToEmail(username);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
