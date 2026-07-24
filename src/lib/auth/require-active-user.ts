import { redirect } from "next/navigation";
import { getAccessDecision } from "@/features/auth/access";
import { createClient } from "@/lib/supabase/server";

export async function requireActiveUser() {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/entrar?motivo=configuracao");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar");
  }

  const decision = await getAccessDecision(supabase, user);

  if (decision.status !== "active") {
    redirect(decision.destination as never);
  }

  return { profile: decision.profile, supabase, user };
}
