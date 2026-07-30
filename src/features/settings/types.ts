export type SettingsActionState = {
  message: string | null;
  status: "idle" | "error" | "success";
};

export type AtelierSettings = {
  atelierName: string | null;
  currencyCode: string;
  fullName: string;
  minimumMultiplier: number;
  recommendedMultiplier: number;
  whatsapp: string | null;
};
