import { NextResponse, type NextRequest } from "next/server";
import { getAccessDecision } from "@/features/auth/access";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/painel";
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.redirect(new URL("/entrar?motivo=configuracao", request.url));
  }

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/entrar", request.url));
  }

  if (next === "/redefinir-senha") {
    return NextResponse.redirect(new URL("/redefinir-senha", request.url));
  }

  const decision = await getAccessDecision(supabase, user);
  return NextResponse.redirect(new URL(decision.destination, request.url));
}
