import { SettingsForm } from "@/components/settings/settings-form";
import { getAtelierSettings } from "@/features/settings/queries";

export default async function ProfilePage() {
  const settings = await getAtelierSettings();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-[color:var(--color-text-muted)]">
          Perfil
        </p>
        <h1 className="mt-1 font-black text-3xl text-[color:var(--color-cream)]">
          Seus dados
        </h1>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
