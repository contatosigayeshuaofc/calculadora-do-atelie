import { notFound } from "next/navigation";
import { CustomerForm } from "@/components/customers/customer-form";
import { getCustomerDetail } from "@/features/customers/queries";
import { getAtelierSettings } from "@/features/settings/queries";

type EditCustomerPageProps = {
  params: Promise<{
    customerId: string;
  }>;
};

export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const { customerId } = await params;
  const [customer, settings] = await Promise.all([
    getCustomerDetail(customerId),
    getAtelierSettings(),
  ]);

  if (!customer) {
    notFound();
  }

  return <CustomerForm countryCode={settings.countryCode} customer={customer} />;
}
