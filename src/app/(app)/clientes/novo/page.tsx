import { CustomerForm } from "@/components/customers/customer-form";
import { getAtelierSettings } from "@/features/settings/queries";

export default async function NewCustomerPage() {
  const settings = await getAtelierSettings();

  return <CustomerForm countryCode={settings.countryCode} />;
}
