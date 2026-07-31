export type SettingsActionState = {
  message: string | null;
  status: "idle" | "error" | "success";
};

export type AtelierSettings = {
  atelierName: string | null;
  countryCode: string;
  currencyCode: string;
  fullName: string;
  minimumMultiplier: number;
  recommendedMultiplier: number;
  whatsapp: string | null;
};
