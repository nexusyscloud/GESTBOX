import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          role: string;
          status: string;
          last_login: string | null;
          permissions: Record<string, boolean>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          role: string;
          status?: string;
          last_login?: string | null;
          permissions?: Record<string, boolean>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          role?: string;
          status?: string;
          last_login?: string | null;
          permissions?: Record<string, boolean>;
          created_at?: string;
          updated_at?: string;
        };
      };
      clientes: {
        Row: {
          id: string;
          empresa_id: string;
          nombre: string;
          identificacion: string | null;
          telefono: string | null;
          email: string | null;
          direccion: string | null;
          estado: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          empresa_id: string;
          nombre: string;
          identificacion?: string | null;
          telefono?: string | null;
          email?: string | null;
          direccion?: string | null;
          estado?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          nombre?: string;
          identificacion?: string | null;
          telefono?: string | null;
          email?: string | null;
          direccion?: string | null;
          estado?: string;
          updated_at?: string;
        };
      };
      ordenes_trabajo: {
        Row: {
          id: string;
          empresa_id: string;
          numero: string;
          cliente_id: string | null;
          vehiculo_id: string | null;
          descripcion: string | null;
          estado: string;
          total: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          empresa_id: string;
          numero: string;
          cliente_id?: string | null;
          vehiculo_id?: string | null;
          descripcion?: string | null;
          estado?: string;
          total?: number | null;
        };
        Update: {
          estado?: string;
          descripcion?: string | null;
          total?: number | null;
          updated_at?: string;
        };
      };
    };
  };
};
