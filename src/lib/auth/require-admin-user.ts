import { redirect } from "next/navigation";
import { canAdminAccess, parseAdminEmails } from "@/features/admin/schemas";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function requireAdminUser() {
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

  const adminEmails = parseAdminEmails(process.env.ADMIN_EMAILS);

  if (!canAdminAccess(user.email, adminEmails)) {
    redirect("/painel");
  }

  const adminClient = createAdminClient();

  return { adminClient, supabase, user };
}
