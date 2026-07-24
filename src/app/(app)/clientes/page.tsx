import { CustomerList } from "@/components/customers/customer-list";
import { listCustomers } from "@/features/customers/queries";

type CustomersPageProps = {
  searchParams: Promise<{
    busca?: string;
  }>;
};

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  const params = await searchParams;
  const customers = await listCustomers({
    search: params.busca,
  });

  return <CustomerList customers={customers} search={params.busca} />;
}
