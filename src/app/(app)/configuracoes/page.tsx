import { SettingsForm } from "@/components/settings/settings-form";
import { getAtelierSettings } from "@/features/settings/queries";

export default async function SettingsPage() {
  const settings = await getAtelierSettings();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-[color:var(--color-text-muted)]">
          Ajustes
        </p>
        <h1 className="mt-1 font-serif text-3xl text-[color:var(--color-warm-graphite)]">
          Configuracoes
        </h1>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
