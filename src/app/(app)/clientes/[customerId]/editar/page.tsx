import { notFound } from "next/navigation";
import { CustomerForm } from "@/components/customers/customer-form";
import { getCustomerDetail } from "@/features/customers/queries";

type EditCustomerPageProps = {
  params: Promise<{
    customerId: string;
  }>;
};

export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const { customerId } = await params;
  const customer = await getCustomerDetail(customerId);

  if (!customer) {
    notFound();
  }

  return <CustomerForm customer={customer} />;
}
