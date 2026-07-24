import type { User } from "@supabase/supabase-js";
import { requireAdminUser } from "@/lib/auth/require-admin-user";
import type { AdminUserSummary, AdminUsersOverview } from "./types";

function emptyOverview(): AdminUsersOverview {
  return {
    needsAdminSetup: true,
    stats: { active: 0, pending: 0, suspended: 0, total: 0 },
    users: [],
  };
}

function userEmailMap(users: User[]) {
  return new Map(users.map((user) => [user.id, user.email ?? null]));
}

export async function listAdminUsers(): Promise<AdminUsersOverview> {
  const { adminClient } = await requireAdminUser();

  if (!adminClient) {
    return emptyOverview();
  }

  const [{ data: profiles, error: profilesError }, authResult] = await Promise.all([
    adminClient
      .from("profiles")
      .select("id, full_name, atelier_name, whatsapp, access_status, activated_at, created_at")
      .order("created_at", { ascending: false }),
    adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  if (profilesError) {
    throw new Error(profilesError.message);
  }

  if (authResult.error) {
    throw new Error(authResult.error.message);
  }

  const emails = userEmailMap(authResult.data.users);
  const users: AdminUserSummary[] = (profiles ?? []).map((profile) => ({
    activatedAt: profile.activated_at,
    atelierName: profile.atelier_name,
    createdAt: profile.created_at,
    email: emails.get(profile.id) ?? null,
    fullName: profile.full_name,
    id: profile.id,
    status: profile.access_status,
    whatsapp: profile.whatsapp,
  }));

  return {
    needsAdminSetup: false,
    stats: {
      active: users.filter((user) => user.status === "active").length,
      pending: users.filter((user) => user.status === "pending").length,
      suspended: users.filter((user) => user.status === "suspended").length,
      total: users.length,
    },
    users,
  };
}
