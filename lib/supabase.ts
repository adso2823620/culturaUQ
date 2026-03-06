import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnon);

// Tipo TypeScript para la tabla
export type Organizacion = {
  id: string;
  razon_social: string;
  municipio: string;
  sector_cultural: string | null;
  tipo_organizacion: string | null;
  tipologia: string | null;
  direccion: string | null;
  correo: string | null;
  telefono_1: string | null;
  instagram: string | null;
  youtube: string | null;
  facebook: string | null;
  latitud: number | null;
  longitud: number | null;
  activa: boolean;
  verificada: boolean;
};

// ── Tipo: capacitaciones ───────────────────────────────────
export type Capacitacion = {
  id: string;
  titulo: string;
  ponente: string | null;
  fecha: string | null;        // "YYYY-MM-DD"
  descripcion: string | null;
  imagen_url: string | null;
  activa: boolean;
  creado_en: string;
};

// ── Tipo: capacitacion_archivos ────────────────────────────
export type CapacitacionArchivo = {
  id: string;
  capacitacion_id: string;
  tipo: 'video' | 'presentacion' | 'material_apoyo' | 'bibliografia' | 'propuesta';
  titulo_archivo: string | null;
  url: string;
  orden: number;
  creado_en: string;
};