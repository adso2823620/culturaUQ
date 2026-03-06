'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import {
  CheckCircle2, ChevronRight, ChevronLeft,
  User, Calendar, MapPin, Users, Building2,
  Upload, X, ArrowRight, Info,
} from 'lucide-react';

// ── Opciones ──────────────────────────────────────────────────────────
const TIPOS_EVENTO = [
  { value: 'taller',                 label: 'Taller'                  },
  { value: 'conversatorio',          label: 'Conversatorio'           },
  { value: 'feria',                  label: 'Feria'                   },
  { value: 'festival',               label: 'Festival'                },
  { value: 'proceso_formacion',      label: 'Proceso de formación'    },
  { value: 'jornada_comunitaria',    label: 'Jornada comunitaria'     },
  { value: 'lanzamiento',            label: 'Lanzamiento'             },
  { value: 'seminario',              label: 'Seminario'               },
  { value: 'exposicion',             label: 'Exposición'              },
  { value: 'presentacion_artistica', label: 'Presentación artística'  },
  { value: 'otro',                   label: 'Otro'                    },
];

const AREAS_ARTISTICAS = [
  'Música', 'Teatro', 'Danza', 'Literatura', 'Artes visuales',
  'Cine / audiovisual', 'Patrimonio cultural', 'Gestión cultural',
  'Cultura comunitaria', 'Multidisciplinar', 'Otro',
];

const MUNICIPIOS = [
  'Manizales', 'Chinchiná', 'Neira', 'Palestina', 'Villamaría',
  'Aranzazu', 'Filadelfia', 'La Merced', 'Manzanares', 'Marquetalia',
  'Marulanda', 'Pácora', 'Pensilvania', 'Riosucio', 'Risaralda',
  'Salamina', 'Samaná', 'San José', 'Supía', 'Victoria', 'Viterbo',
];

const TIPOS_ACCESO = [
  { value: 'gratuito',           label: 'Gratuito'                   },
  { value: 'con_costo',          label: 'Con costo'                  },
  { value: 'aporte_voluntario',  label: 'Aporte voluntario'          },
  { value: 'solo_inscripcion',   label: 'Solo con inscripción previa' },
];

const MEDIOS_PAGO_OPT = ['Transferencia', 'Pago en línea', 'Efectivo', 'Otro'];

const PUBLICOS_OPT = [
  { value: 'ninez',               label: 'Niñez'                    },
  { value: 'adolescencia',        label: 'Adolescencia'             },
  { value: 'juventudes',          label: 'Juventudes'               },
  { value: 'personas_mayores',    label: 'Personas mayores'         },
  { value: 'mujeres',             label: 'Mujeres'                  },
  { value: 'lgbtiq',              label: 'Población LGBTIQ+'        },
  { value: 'campesinado',         label: 'Campesinado'              },
  { value: 'comunidades_etnicas', label: 'Comunidades étnicas'      },
  { value: 'discapacidad',        label: 'Personas con discapacidad'},
  { value: 'victimas',            label: 'Víctimas del conflicto'   },
  { value: 'gestores',            label: 'Gestores culturales'      },
  { value: 'publico_general',     label: 'Público general'          },
  { value: 'otro',                label: 'Otro'                     },
];

const TIPOS_ORG = [
  'Fundación', 'Asociación', 'Colectivo', 'Corporación', 'ONG',
  'Empresa cultural', 'Artista independiente', 'Entidad pública', 'Otro',
];

// ── Tipo ──────────────────────────────────────────────────────────────
type EventoForm = {
  nombre_contacto: string; correo_contacto: string;
  whatsapp_contacto: string; telefono_contacto: string;
  titulo: string; tipo_evento: string; area_artistica: string; descripcion: string;
  fecha_inicio: string; hora_inicio: string; fecha_fin: string;
  fecha_limite_inscripcion: string;
  modalidad: string; municipio: string; lugar_nombre: string;
  direccion: string; enlace_acceso: string;
  tipo_acceso: string; valor_entrada: string; num_cupos: string;
  medios_pago: string[]; publicos: string[];
  nombre_organizacion: string; tipo_organizacion_evento: string;
  nit_organizacion: string; responsable_evento: string;
  redes_sociales: string; aliados: string;
  imagen_url: string; texto_invitacion: string;
  autoriza_datos: boolean; autoriza_difusion: boolean; autoriza_piezas: boolean;
};

const INITIAL: EventoForm = {
  nombre_contacto: '', correo_contacto: '', whatsapp_contacto: '', telefono_contacto: '',
  titulo: '', tipo_evento: '', area_artistica: '', descripcion: '',
  fecha_inicio: '', hora_inicio: '', fecha_fin: '', fecha_limite_inscripcion: '',
  modalidad: '', municipio: '', lugar_nombre: '', direccion: '', enlace_acceso: '',
  tipo_acceso: '', valor_entrada: '', num_cupos: '', medios_pago: [], publicos: [],
  nombre_organizacion: '', tipo_organizacion_evento: '', nit_organizacion: '',
  responsable_evento: '', redes_sociales: '', aliados: '',
  imagen_url: '', texto_invitacion: '',
  autoriza_datos: false, autoriza_difusion: false, autoriza_piezas: false,
};

const FORM_STEPS = [
  { number: 1, label: 'Contacto',     icon: User      },
  { number: 2, label: 'El Evento',    icon: Calendar  },
  { number: 3, label: 'Lugar',        icon: MapPin    },
  { number: 4, label: 'Acceso',       icon: Users     },
  { number: 5, label: 'Organización', icon: Building2 },
];

// ── Chips de selección múltiple ───────────────────────────────────────
function toggleArray(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
        active
          ? 'bg-[#1E2B5C] border-[#1E2B5C] text-white'
          : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
      }`}>
      {active && <span className="mr-1">✓</span>}{label}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════
export default function RegistraEventoForm() {
  const [step, setStep]                   = useState(1);
  const [form, setForm]                   = useState<EventoForm>(INITIAL);
  const [fotoPreview, setFotoPreview]     = useState<string | null>(null);
  const [loading, setLoading]             = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [error, setError]                 = useState('');
  const [submitted, setSubmitted]         = useState(false);

  const set = (field: keyof EventoForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const setSelect = (field: keyof EventoForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canNext = () => {
    if (step === 1) return form.nombre_contacto.trim() !== '' && form.correo_contacto.trim() !== '';
    if (step === 2) return form.titulo.trim() !== '' && form.fecha_inicio !== '';
    if (step === 3) return form.modalidad !== '';
    if (step === 4) return form.tipo_acceso !== '' && form.publicos.length > 0;
    return form.nombre_organizacion.trim() !== '' && form.autoriza_datos;
  };

  // ── Subida foto ───────────────────────────────────────────────────
  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Solo se permiten imágenes.'); return; }
    if (file.size > 2 * 1024 * 1024) { setError('La imagen no puede superar 2MB.'); return; }
    setError('');
    setUploadingFoto(true);
    try {
      setFotoPreview(URL.createObjectURL(file));
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('eventos-fotos').upload(fileName, file, { upsert: false });
      if (uploadError) throw new Error(uploadError.message);
      const { data: urlData } = supabase.storage.from('eventos-fotos').getPublicUrl(fileName);
      setForm((prev) => ({ ...prev, imagen_url: urlData.publicUrl }));
    } catch {
      setError('Error al subir la imagen.');
      setFotoPreview(null);
    } finally {
      setUploadingFoto(false);
    }
  };

  // ── Enviar ────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.autoriza_datos) { setError('Debes autorizar el tratamiento de datos.'); return; }
    setLoading(true); setError('');
    try {
      const { error: dbError } = await supabase.from('eventos_culturales').insert([{
        nombre_contacto:          form.nombre_contacto,
        correo_contacto:          form.correo_contacto,
        telefono_contacto:        form.telefono_contacto        || null,
        whatsapp_contacto:        form.whatsapp_contacto        || null,
        titulo:                   form.titulo,
        tipo_evento:              form.tipo_evento              || null,
        area_artistica:           form.area_artistica           || null,
        descripcion:              form.descripcion              || null,
        fecha_inicio:             form.fecha_inicio,
        hora_inicio:              form.hora_inicio              || null,
        fecha_fin:                form.fecha_fin                || null,
        fecha_limite_inscripcion: form.fecha_limite_inscripcion || null,
        modalidad:                form.modalidad,
        municipio:                form.municipio                || null,
        lugar_nombre:             form.lugar_nombre             || null,
        direccion:                form.direccion                || null,
        enlace_acceso:            form.enlace_acceso            || null,
        tipo_acceso:              form.tipo_acceso              || null,
        valor_entrada:            form.valor_entrada            || null,
        num_cupos:                form.num_cupos ? Number(form.num_cupos) : null,
        medios_pago:              form.medios_pago.length ? form.medios_pago : null,
        publicos:                 form.publicos.length   ? form.publicos    : null,
        nombre_organizacion:      form.nombre_organizacion,
        tipo_organizacion_evento: form.tipo_organizacion_evento || null,
        nit_organizacion:         form.nit_organizacion         || null,
        responsable_evento:       form.responsable_evento       || null,
        redes_sociales:           form.redes_sociales           || null,
        aliados:                  form.aliados                  || null,
        imagen_url:               form.imagen_url               || null,
        texto_invitacion:         form.texto_invitacion         || null,
        autoriza_datos:           form.autoriza_datos,
        autoriza_difusion:        form.autoriza_difusion,
        autoriza_piezas:          form.autoriza_piezas,
        estado:                   'pendiente',
      }]);

      if (dbError) { console.error('DB:', JSON.stringify(dbError)); throw new Error(dbError.message); }

      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      console.log('📧 Admin email:', adminEmail);

      const { error: fnError, data: fnData } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'nuevo_evento',
          to:   adminEmail,
          data: {
            titulo:              form.titulo,
            nombre_organizacion: form.nombre_organizacion,
            municipio:           form.municipio,
            fecha_inicio:        form.fecha_inicio,
            tipo_evento:         form.tipo_evento,
            correo_contacto:     form.correo_contacto,
          },
        },
      });

      if (fnError) {
        console.error('❌ Email error:', JSON.stringify(fnError));
      } else {
        console.log('✅ Email enviado:', JSON.stringify(fnData));
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const ErrorBox = ({ msg }: { msg: string }) => (
    <div className="flex gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
      <span className="shrink-0 mt-0.5">⚠️</span><span>{msg}</span>
    </div>
  );

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-base font-semibold text-[#1E2B5C] pb-3 border-b border-gray-100 mb-5">{children}</h3>
  );

  // ── Éxito ─────────────────────────────────────────────────────────
  if (submitted) return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-[#1E2B5C] mb-3">¡Evento registrado!</h2>
      <p className="text-gray-500 leading-relaxed mb-3">
        <span className="font-semibold text-[#1E2B5C]">"{form.titulo}"</span> fue enviado y está pendiente de aprobación.
      </p>
      <div className="flex items-start gap-2.5 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 text-left mb-8">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <span>El equipo de Cultura Caldas revisará la información. Te contactaremos a <strong>{form.correo_contacto}</strong> si necesitamos algo.</span>
      </div>
      <Button variant="outline"
        onClick={() => { setForm(INITIAL); setStep(1); setSubmitted(false); setFotoPreview(null); }}
        className="border-gray-200 text-gray-600 rounded-xl">
        Registrar otro evento
      </Button>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">

      {/* Aviso moderación */}
      <div className="flex items-start gap-2.5 p-4 bg-amber-50 border border-amber-100 rounded-2xl mb-8 text-sm text-amber-800">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
        <span>Los eventos son revisados antes de aparecer en la Agenda pública. El proceso toma normalmente 1–2 días hábiles.</span>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {FORM_STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive    = step === s.number;
          const isCompleted = step > s.number;
          return (
            <div key={s.number} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isCompleted ? 'bg-[#F47920]' : isActive ? 'bg-[#1E2B5C]' : 'bg-gray-100'
                }`}>
                  {isCompleted
                    ? <CheckCircle2 className="w-4 h-4 text-white" />
                    : <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  }
                </div>
                <span className={`text-xs mt-1 hidden sm:block font-medium ${
                  isActive ? 'text-[#1E2B5C]' : isCompleted ? 'text-[#F47920]' : 'text-gray-400'
                }`}>{s.label}</span>
              </div>
              {i < FORM_STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 mb-4 transition-all ${step > s.number ? 'bg-[#F47920]' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-8">

          {/* PASO 1 — Contacto */}
          {step === 1 && (
            <div className="space-y-5">
              <SectionTitle>Datos de contacto</SectionTitle>
              <div>
                <Label htmlFor="e-nc" className="text-sm font-medium text-gray-700">Nombre de quien registra *</Label>
                <Input id="e-nc" value={form.nombre_contacto} onChange={set('nombre_contacto')}
                  placeholder="Tu nombre completo" className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="e-correo" className="text-sm font-medium text-gray-700">Correo electrónico *</Label>
                <Input id="e-correo" type="email" value={form.correo_contacto} onChange={set('correo_contacto')}
                  placeholder="correo@tuorganizacion.com" className="mt-1.5 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="e-tel" className="text-sm font-medium text-gray-700">Teléfono</Label>
                  <Input id="e-tel" type="tel" value={form.telefono_contacto} onChange={set('telefono_contacto')}
                    placeholder="600 000 0000" className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="e-wa" className="text-sm font-medium text-gray-700">WhatsApp</Label>
                  <Input id="e-wa" type="tel" value={form.whatsapp_contacto} onChange={set('whatsapp_contacto')}
                    placeholder="300 000 0000" className="mt-1.5 rounded-xl" />
                </div>
              </div>
            </div>
          )}

          {/* PASO 2 — El Evento */}
          {step === 2 && (
            <div className="space-y-5">
              <SectionTitle>Información del evento</SectionTitle>
              <div>
                <Label htmlFor="e-titulo" className="text-sm font-medium text-gray-700">Título del evento *</Label>
                <Input id="e-titulo" value={form.titulo} onChange={set('titulo')}
                  placeholder="Nombre del evento" className="mt-1.5 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Tipo de evento</Label>
                  <Select value={form.tipo_evento} onValueChange={setSelect('tipo_evento')}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                    <SelectContent>{TIPOS_EVENTO.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Área artística / temática</Label>
                  <Select value={form.area_artistica} onValueChange={setSelect('area_artistica')}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                    <SelectContent>{AREAS_ARTISTICAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="e-desc" className="text-sm font-medium text-gray-700">Descripción general</Label>
                <textarea id="e-desc" value={form.descripcion} onChange={set('descripcion')}
                  placeholder="Cuéntanos de qué trata el evento..." rows={3}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F47920]/20 focus:border-[#F47920] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="e-fi" className="text-sm font-medium text-gray-700">Fecha de inicio *</Label>
                  <Input id="e-fi" type="date" value={form.fecha_inicio} onChange={set('fecha_inicio')} className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="e-hi" className="text-sm font-medium text-gray-700">Hora de inicio</Label>
                  <Input id="e-hi" type="time" value={form.hora_inicio} onChange={set('hora_inicio')} className="mt-1.5 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="e-ff" className="text-sm font-medium text-gray-700">Fecha de finalización</Label>
                  <Input id="e-ff" type="date" value={form.fecha_fin} onChange={set('fecha_fin')} min={form.fecha_inicio} className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="e-fli" className="text-sm font-medium text-gray-700">
                    Fecha límite de inscripción
                  </Label>
                  <Input id="e-fli" type="date" value={form.fecha_limite_inscripcion}
                    onChange={set('fecha_limite_inscripcion')} max={form.fecha_inicio} className="mt-1.5 rounded-xl" />
                </div>
              </div>
            </div>
          )}

          {/* PASO 3 — Lugar */}
          {step === 3 && (
            <div className="space-y-5">
              <SectionTitle>Modalidad y ubicación</SectionTitle>
              <div>
                <Label className="text-sm font-medium text-gray-700">Modalidad *</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { value: 'presencial', label: 'Presencial' },
                    { value: 'virtual',    label: 'Virtual'    },
                    { value: 'hibrido',    label: 'Híbrido'    },
                  ].map(({ value, label }) => (
                    <button key={value} type="button"
                      onClick={() => setForm((p) => ({ ...p, modalidad: value }))}
                      className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.modalidad === value
                          ? 'border-[#1E2B5C] bg-[#1E2B5C] text-white'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>{label}
                    </button>
                  ))}
                </div>
              </div>

              {(form.modalidad === 'presencial' || form.modalidad === 'hibrido') && <>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Municipio</Label>
                  <Select value={form.municipio} onValueChange={setSelect('municipio')}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Selecciona el municipio" /></SelectTrigger>
                    <SelectContent>{MUNICIPIOS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="e-lugar" className="text-sm font-medium text-gray-700">Lugar del evento</Label>
                  <Input id="e-lugar" value={form.lugar_nombre} onChange={set('lugar_nombre')}
                    placeholder="Departamento / Municipio / Barrio / Vereda" className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="e-dir" className="text-sm font-medium text-gray-700">Dirección exacta</Label>
                  <Input id="e-dir" value={form.direccion} onChange={set('direccion')}
                    placeholder="Carrera 23 #23-06" className="mt-1.5 rounded-xl" />
                </div>
              </>}

              {(form.modalidad === 'virtual' || form.modalidad === 'hibrido') && (
                <div>
                  <Label htmlFor="e-link" className="text-sm font-medium text-gray-700">Enlace de acceso al evento</Label>
                  <Input id="e-link" type="url" value={form.enlace_acceso} onChange={set('enlace_acceso')}
                    placeholder="https://meet.google.com/..." className="mt-1.5 rounded-xl" />
                </div>
              )}
            </div>
          )}

          {/* PASO 4 — Acceso y públicos */}
          {step === 4 && (
            <div className="space-y-6">
              <SectionTitle>Acceso al evento</SectionTitle>

              <div>
                <Label className="text-sm font-medium text-gray-700">Tipo de acceso *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {TIPOS_ACCESO.map(({ value, label }) => (
                    <button key={value} type="button"
                      onClick={() => setForm((p) => ({ ...p, tipo_acceso: value }))}
                      className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                        form.tipo_acceso === value
                          ? 'border-[#1E2B5C] bg-[#1E2B5C] text-white'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>{label}
                    </button>
                  ))}
                </div>
              </div>

              {form.tipo_acceso !== '' && (
                <div>
                  <Label htmlFor="e-cupos" className="text-sm font-medium text-gray-700">
                    Número de cupos disponibles{' '}
                    <span className="text-gray-400 font-normal">(dejar vacío si no hay límite)</span>
                  </Label>
                  <Input id="e-cupos" type="number" min="0" value={form.num_cupos}
                    onChange={set('num_cupos')} placeholder="100" className="mt-1.5 rounded-xl" />
                </div>
              )}

              {form.tipo_acceso === 'con_costo' && <>
                <div>
                  <Label htmlFor="e-valor" className="text-sm font-medium text-gray-700">Valor de la entrada o inscripción</Label>
                  <Input id="e-valor" value={form.valor_entrada} onChange={set('valor_entrada')}
                    placeholder="Ej: $15.000 general — $8.000 estudiantes" className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Medios de pago disponibles</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {MEDIOS_PAGO_OPT.map((m) => (
                      <Chip key={m} label={m} active={form.medios_pago.includes(m)}
                        onClick={() => setForm((p) => ({ ...p, medios_pago: toggleArray(p.medios_pago, m) }))} />
                    ))}
                  </div>
                </div>
              </>}

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Públicos a los que va dirigido *
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PUBLICOS_OPT.map(({ value, label }) => (
                    <Chip key={value} label={label} active={form.publicos.includes(value)}
                      onClick={() => setForm((p) => ({ ...p, publicos: toggleArray(p.publicos, value) }))} />
                  ))}
                </div>
                {form.publicos.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1.5">Selecciona al menos un público</p>
                )}
              </div>
            </div>
          )}

          {/* PASO 5 — Organización + Material + Autorizaciones */}
          {step === 5 && (
            <div className="space-y-5">
              <SectionTitle>Organización responsable</SectionTitle>
              <div>
                <Label htmlFor="e-org" className="text-sm font-medium text-gray-700">Nombre de la organización *</Label>
                <Input id="e-org" value={form.nombre_organizacion} onChange={set('nombre_organizacion')}
                  placeholder="Fundación, colectivo, artista..." className="mt-1.5 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Tipo de organización</Label>
                  <Select value={form.tipo_organizacion_evento} onValueChange={setSelect('tipo_organizacion_evento')}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Tipo" /></SelectTrigger>
                    <SelectContent>{TIPOS_ORG.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="e-nit" className="text-sm font-medium text-gray-700">
                    NIT <span className="text-gray-400 font-normal">(opcional)</span>
                  </Label>
                  <Input id="e-nit" value={form.nit_organizacion} onChange={set('nit_organizacion')}
                    placeholder="900.000.000-1" className="mt-1.5 rounded-xl" />
                </div>
              </div>
              <div>
                <Label htmlFor="e-resp" className="text-sm font-medium text-gray-700">Persona responsable del evento</Label>
                <Input id="e-resp" value={form.responsable_evento} onChange={set('responsable_evento')}
                  placeholder="Nombre completo y cargo" className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="e-redes" className="text-sm font-medium text-gray-700">Redes sociales o sitio web</Label>
                <Input id="e-redes" value={form.redes_sociales} onChange={set('redes_sociales')}
                  placeholder="@tuorganizacion o https://..." className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="e-aliados" className="text-sm font-medium text-gray-700">Aliados o coorganizadores</Label>
                <Input id="e-aliados" value={form.aliados} onChange={set('aliados')}
                  placeholder="Nombres de aliados o coorganizadores" className="mt-1.5 rounded-xl" />
              </div>

              {/* Material */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <p className="text-base font-semibold text-[#1E2B5C]">Material de divulgación</p>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Flyer o imagen del evento{' '}
                    <span className="text-xs text-gray-400 font-normal">JPG o PNG · máx. 2MB</span>
                  </Label>
                  {!fotoPreview ? (
                    <label htmlFor="e-foto" className={`mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      uploadingFoto ? 'border-[#F47920] bg-[#F47920]/5' : 'border-gray-200 hover:border-[#F47920]/60 hover:bg-orange-50'
                    }`}>
                      {uploadingFoto
                        ? <div className="flex flex-col items-center gap-2 text-[#F47920]">
                            <div className="w-6 h-6 border-2 border-[#F47920] border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">Subiendo...</span>
                          </div>
                        : <div className="flex flex-col items-center gap-1.5 text-gray-400">
                            <Upload className="w-6 h-6" />
                            <span className="text-sm">Clic para subir flyer o imagen</span>
                          </div>
                      }
                      <input id="e-foto" type="file" accept="image/*" className="hidden"
                        onChange={handleFotoChange} disabled={uploadingFoto} />
                    </label>
                  ) : (
                    <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden border border-gray-200">
                      <Image src={fotoPreview} alt="Preview" fill className="object-cover" />
                      <button onClick={() => { setFotoPreview(null); setForm((p) => ({ ...p, imagen_url: '' })); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="e-inv" className="text-sm font-medium text-gray-700">
                    Texto corto de invitación{' '}
                    <span className="text-xs text-gray-400 font-normal">para difusión en redes</span>
                  </Label>
                  <textarea id="e-inv" value={form.texto_invitacion} onChange={set('texto_invitacion')}
                    placeholder="¡Te invitamos a... ! Un espacio para..." rows={2}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F47920]/20 focus:border-[#F47920] resize-none" />
                </div>
              </div>

              {/* Autorizaciones */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <p className="text-base font-semibold text-[#1E2B5C]">Autorizaciones</p>
                {[
                  { field: 'autoriza_datos'    as const, label: 'Autorizo el tratamiento de mis datos personales según la Ley 1581 de 2012 *' },
                  { field: 'autoriza_difusion' as const, label: 'Autorizo divulgar esta información en plataformas, redes sociales y medios aliados' },
                  { field: 'autoriza_piezas'   as const, label: 'Autorizo el uso de piezas gráficas, imágenes o videos enviados para fines de divulgación cultural' },
                ].map(({ field, label }) => (
                  <label key={field} className="flex items-start gap-3 cursor-pointer group">
                    <div onClick={() => setForm((p) => ({ ...p, [field]: !p[field] }))}
                      className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                        form[field] ? 'bg-[#1E2B5C] border-[#1E2B5C]' : 'border-gray-300 group-hover:border-gray-400'
                      }`}>
                      {form[field] && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-600 leading-snug">{label}</span>
                  </label>
                ))}
              </div>

              {error && <ErrorBox msg={error} />}
            </div>
          )}

          {/* Navegación */}
          <div className={`flex mt-8 pt-6 border-t border-gray-100 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
            {step > 1 && (
              <Button variant="outline" onClick={() => { setStep(step - 1); setError(''); }} disabled={loading}
                className="border-gray-200 text-gray-600 rounded-xl">
                <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
              </Button>
            )}
            {step < 5
              ? <Button onClick={() => { if (canNext()) { setStep(step + 1); setError(''); } }} disabled={!canNext()}
                  className="bg-[#1E2B5C] hover:bg-[#2d3f7a] text-white rounded-xl px-6">
                  Siguiente <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              : <Button onClick={handleSubmit} disabled={loading || uploadingFoto || !form.autoriza_datos}
                  className="bg-[#F47920] hover:bg-[#d4621a] text-white rounded-xl px-8 font-semibold">
                  {loading
                    ? <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </span>
                    : <span className="flex items-center gap-2">Enviar evento <ArrowRight className="w-4 h-4" /></span>
                  }
                </Button>
            }
          </div>

        </CardContent>
      </Card>
    </div>
  );
}