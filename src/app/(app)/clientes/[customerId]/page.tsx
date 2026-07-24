import { notFound } from "next/navigation";
import { CustomerDetail } from "@/components/customers/customer-detail";
import { getCustomerDetail } from "@/features/customers/queries";

type CustomerPageProps = {
  params: Promise<{
    customerId: string;
  }>;
};

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { customerId } = await params;
  const customer = await getCustomerDetail(customerId);

  if (!customer) {
    notFound();
  }

  return <CustomerDetail customer={customer} />;
}
