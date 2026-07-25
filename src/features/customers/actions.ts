"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireActiveUser } from "@/lib/auth/require-active-user";
import {
  getCustomerFormError,
  parseCustomerFormData,
} from "./schemas";
import type { CustomerActionState } from "./types";

export async function saveCustomerAction(
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  let customerId: string;

  try {
    const payload = formData.get("payload");

    if (typeof payload !== "string") {
      throw new Error("Não foi possível ler os dados da cliente.");
    }

    const customer = parseCustomerFormData(JSON.parse(payload));
    const { supabase, user } = await requireActiveUser();
    const record = {
      user_id: user.id,
      name: customer.name,
      whatsapp: customer.whatsapp,
      instagram: customer.instagram,
      city: customer.city,
      birthday: customer.birthday,
      notes: customer.notes,
    };

    const query = customer.customerId
      ? supabase
          .from("customers")
          .update(record)
          .eq("id", customer.customerId)
          .select("id")
          .single()
      : supabase.from("customers").insert(record).select("id").single();

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    customerId = data.id;
  } catch (error) {
    return {
      status: "error",
      message: getCustomerFormError(error),
    };
  }

  revalidateCustomers(customerId);
  redirect(`/clientes/${customerId}` as never);
}

function revalidateCustomers(customerId: string) {
  revalidatePath("/clientes");
  revalidatePath(`/clientes/${customerId}` as never);
  revalidatePath(`/clientes/${customerId}/editar` as never);
  revalidatePath("/painel");
}
