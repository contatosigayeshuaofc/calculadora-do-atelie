import Link from "next/link";
import { Clock3, LogOut } from "lucide-react";
import { Button } from "@/components/ui";
import { signOutAction } from "@/features/auth/actions";

export default function WaitingAccessPage() {
  return (
    <main className="atelier-shell">
      <section className="atelier-panel w-full max-w-xl p-6 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(98,121,88,0.12)] text-[color:var(--color-olive)]">
          <Clock3 className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-6 font-[var(--font-cormorant)] text-5xl leading-none text-[color:var(--color-warm-graphite)]">Aguardando liberacao</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[color:var(--color-text-muted)]">
          Sua conta foi criada e entrara no app assim que a compra for conferida manualmente.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={"/entrar" as never}>
            <Button variant="secondary">Verificar novamente</Button>
          </Link>
          <form action={signOutAction}>
            <Button leftIcon={<LogOut className="h-4 w-4" aria-hidden="true" />} type="submit" variant="ghost">
              Sair
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
