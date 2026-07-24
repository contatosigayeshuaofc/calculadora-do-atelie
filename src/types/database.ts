export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AccessStatus = "pending" | "active" | "suspended";

export type OrderStatus =
  | "quote"
  | "awaiting_payment"
  | "confirmed"
  | "in_production"
  | "ready"
  | "delivered"
  | "canceled";

export type PaymentStatus = "unpaid" | "partially_paid" | "paid";

type PublicEnums = {
  access_status: AccessStatus;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
};

type RowWithTimestamps = {
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          atelier_name: string | null;
          whatsapp: string | null;
          access_status: AccessStatus;
          activated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          atelier_name?: string | null;
          whatsapp?: string | null;
          access_status?: AccessStatus;
          activated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          atelier_name?: string | null;
          whatsapp?: string | null;
          access_status?: AccessStatus;
          activated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          minimum_price_multiplier: number;
          recommended_price_multiplier: number;
          currency_code: string;
        } & RowWithTimestamps;
        Insert: {
          id?: string;
          user_id: string;
          minimum_price_multiplier?: number;
          recommended_price_multiplier?: number;
          currency_code?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          minimum_price_multiplier?: number;
          recommended_price_multiplier?: number;
          currency_code?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string | null;
          description: string | null;
          sale_unit: string;
          batch_yield: number;
          packaging_cost_per_unit_cents: number;
          additional_batch_cost_cents: number;
          material_cost_batch_cents: number;
          packaging_cost_batch_cents: number;
          total_cost_batch_cents: number;
          unit_cost_cents: number;
          minimum_price_cents: number;
          recommended_price_cents: number;
          selling_price_cents: number;
          is_active: boolean;
        } & RowWithTimestamps;
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category?: string | null;
          description?: string | null;
          sale_unit?: string;
          batch_yield: number;
          packaging_cost_per_unit_cents?: number;
          additional_batch_cost_cents?: number;
          material_cost_batch_cents?: number;
          packaging_cost_batch_cents?: number;
          total_cost_batch_cents?: number;
          unit_cost_cents?: number;
          minimum_price_cents?: number;
          recommended_price_cents?: number;
          selling_price_cents?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      product_cost_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          name: string;
          unit_measure: string;
          purchase_quantity: number;
          purchase_price_cents: number;
          used_quantity: number;
          calculated_cost_cents: number;
          sort_order: number;
        } & RowWithTimestamps;
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          name: string;
          unit_measure: string;
          purchase_quantity: number;
          purchase_price_cents: number;
          used_quantity: number;
          calculated_cost_cents: number;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_cost_items"]["Insert"]>;
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          whatsapp: string | null;
          instagram: string | null;
          city: string | null;
          birthday: string | null;
          notes: string | null;
        } & RowWithTimestamps;
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          whatsapp?: string | null;
          instagram?: string | null;
          city?: string | null;
          birthday?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
        Relationships: [];
      };
      sales: {
        Row: {
          id: string;
          user_id: string;
          customer_id: string | null;
          order_date: string;
          delivery_date: string | null;
          status: OrderStatus;
          payment_status: PaymentStatus;
          payment_method: string | null;
          subtotal_cents: number;
          discount_cents: number;
          delivery_fee_cents: number;
          total_cents: number;
          estimated_cost_cents: number;
          estimated_profit_cents: number;
          notes: string | null;
        } & RowWithTimestamps;
        Insert: {
          id?: string;
          user_id: string;
          customer_id?: string | null;
          order_date: string;
          delivery_date?: string | null;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_method?: string | null;
          subtotal_cents?: number;
          discount_cents?: number;
          delivery_fee_cents?: number;
          total_cents?: number;
          estimated_cost_cents?: number;
          estimated_profit_cents?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sales"]["Insert"]>;
        Relationships: [];
      };
      sale_items: {
        Row: {
          id: string;
          user_id: string;
          sale_id: string;
          product_id: string | null;
          product_name_snapshot: string;
          sale_unit_snapshot: string;
          quantity: number;
          unit_price_cents: number;
          unit_cost_snapshot_cents: number;
          minimum_price_snapshot_cents: number;
          recommended_price_snapshot_cents: number;
          subtotal_cents: number;
          estimated_cost_cents: number;
          estimated_profit_cents: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sale_id: string;
          product_id?: string | null;
          product_name_snapshot: string;
          sale_unit_snapshot: string;
          quantity: number;
          unit_price_cents: number;
          unit_cost_snapshot_cents: number;
          minimum_price_snapshot_cents: number;
          recommended_price_snapshot_cents: number;
          subtotal_cents: number;
          estimated_cost_cents: number;
          estimated_profit_cents: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sale_items"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: PublicEnums;
    CompositeTypes: Record<string, never>;
  };
};
