import type { AccessStatus } from "@/types/database";

export type AdminActionState = {
  message: string;
  status: "idle" | "error" | "success";
};

export type AdminUserSummary = {
  activatedAt: string | null;
  atelierName: string | null;
  createdAt: string;
  email: string | null;
  fullName: string | null;
  id: string;
  status: AccessStatus;
  whatsapp: string | null;
};

export type AdminUsersOverview = {
  needsAdminSetup: boolean;
  stats: {
    active: number;
    pending: number;
    suspended: number;
    total: number;
  };
  users: AdminUserSummary[];
};
