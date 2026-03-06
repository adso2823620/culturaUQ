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
  CheckCircle2, ChevronRight, ChevronLeft, Mail, KeyRound,
  Building2, MapPin, Share2, Upload, X, RefreshCw, ArrowRight,
} from 'lucide-react';

// ── Opciones ───────────────────────────────────────────────────────────
const SECTORES = [
  'Música', 'Teatro', 'Danza', 'Artesanías', 'Patrimonio',
  'Audiovisual', 'Artes Visuales', 'Cultural y Social', 'Educativo', 'Comunitario',
];
const TIPOS_ORGANIZACION = [
  'Asociación', 'Fundación', 'Corporación', 'Colectivo',
  'Grupo Artístico', 'Empresa Cultural', 'Institución Pública', 'Otro',
];
const TIPOLOGIAS = [
  'Artes Escénicas', 'Artes Plásticas y Visuales', 'Literatura',
  'Música', 'Patrimonio Cultural', 'Cinematografía y Medios Audiovisuales',
  'Cultura Popular y Tradicional', 'Otro',
];
const MUNICIPIOS = [
  'Manizales', 'Chinchiná', 'Neira', 'Palestina', 'Villamaría',
  'Aranzazu', 'Filadelfia', 'La Merced', 'Manzanares', 'Marquetalia',
  'Marulanda', 'Pácora', 'Pensilvania', 'Riosucio', 'Risaralda',
  'Salamina', 'Samaná', 'San José', 'Supía', 'Victoria', 'Viterbo',
];

// ── Tipo exacto según columnas reales de la BD ─────────────────────────
type OrgForm = {
  razon_social: string;
  tipo_organizacion: string;
  tipologia: string;
  sector_cultural: string;
  municipio: string;
  direccion: string;
  zona: string;
  barrio: string;
  comuna_corregimiento: string;   // ← nombre real en organizaciones_culturales
  nombre_contacto: string;
  cargo_contacto: string;
  telefono_1: string;
  telefono_2: string;
  correo: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  youtube: string;
  foto_url: string;
};

type FlowStage = 'email' | 'codigo' | 'form' | 'success';

const FORM_STEPS = [
  { number: 1, label: 'Organización', icon: Building2 },
  { number: 2, label: 'Ubicación',    icon: MapPin    },
  { number: 3, label: 'Foto y Redes', icon: Share2    },
];

function generarCodigo(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ══════════════════════════════════════════════════════════════════════
export default function ActualizaInfoForm() {

  const [stage, setStage]                       = useState<FlowStage>('email');
  const [correoVerificado, setCorreoVerificado] = useState('');
  const [orgId, setOrgId]                       = useState('');
  const [orgNombre, setOrgNombre]               = useState('');
  const [formStep, setFormStep]                 = useState(1);
  const [form, setForm]                         = useState<OrgForm>({
    razon_social: '', tipo_organizacion: '', tipologia: '', sector_cultural: '',
    municipio: '', direccion: '', zona: '', barrio: '', comuna_corregimiento: '',
    nombre_contacto: '', cargo_contacto: '',
    telefono_1: '', telefono_2: '', correo: '', whatsapp: '',
    instagram: '', facebook: '', youtube: '', foto_url: '',
  });
  const [fotoPreview, setFotoPreview]           = useState<string | null>(null);
  const [emailInput, setEmailInput]             = useState('');
  const [codigoInput, setCodigoInput]           = useState('');
  const [loading, setLoading]                   = useState(false);
  const [uploadingFoto, setUploadingFoto]       = useState(false);
  const [error, setError]                       = useState('');
  const [countdown, setCountdown]               = useState(0);

  // ── helpers ──────────────────────────────────────────────────────────
  const set = (field: keyof OrgForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const setSelect = (field: keyof OrgForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canNextForm = () => {
    if (formStep === 1) return form.razon_social.trim() !== '' && form.sector_cultural !== '';
    if (formStep === 2) return form.municipio !== '' && form.correo.trim() !== '' && form.telefono_1.trim() !== '';
    return true;
  };

  const resetFlow = () => {
    setStage('email'); setEmailInput(''); setCodigoInput('');
    setError(''); setFormStep(1); setOrgId(''); setOrgNombre(''); setFotoPreview(null);
  };

  // ── PASO A: buscar correo y enviar código ─────────────────────────────
  const handleEnviarCodigo = async () => {
    const correo = emailInput.trim().toLowerCase();
    if (!correo) { setError('Ingresa tu correo electrónico.'); return; }
    setError('');
    setLoading(true);
    try {
      // .filter con 'ilike' → case-insensitive en Supabase JS v2
      // No usar .ilike() directo ni .eq() — .filter es el método correcto
      const { data: orgs, error: searchError } = await supabase
        .from('organizaciones_culturales')
        .select(`
          id, razon_social, tipo_organizacion, tipologia, sector_cultural,
          municipio, direccion, zona, barrio, comuna_corregimiento,
          nombre_contacto, cargo_contacto,
          telefono_1, telefono_2, correo, whatsapp,
          instagram, facebook, youtube, foto_url
        `)
        .filter('correo', 'ilike', correo)
        .eq('activa', true)
        .limit(1);

      if (searchError) {
        console.error('Error BD:', searchError.message);
        setError('Error al buscar tu organización. Intenta de nuevo.');
        setLoading(false);
        return;
      }

      const org = orgs?.[0] ?? null;
      if (!org) {
        setError('No encontramos ninguna organización activa con ese correo. Verifica que sea el correo con el que te registraste.');
        setLoading(false);
        return;
      }

      // Guardar código
      const codigo    = generarCodigo();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      const { error: insertError } = await supabase
        .from('codigos_verificacion')
        .insert([{ correo, codigo, expires_at: expiresAt }]);
      if (insertError) throw new Error(insertError.message);

      // Enviar email
      const { error: fnError } = await supabase.functions.invoke('send-email', {
        body: { type: 'codigo_verificacion', to: correo,
                data: { codigo, razon_social: org.razon_social, expires_minutes: 15 } },
      });
      if (fnError) console.warn('Email no enviado:', fnError.message);

      // Pre-llenar form con datos actuales de la BD
      setOrgId(org.id);
      setOrgNombre(org.razon_social);
      setCorreoVerificado(correo);
      setForm({
        razon_social:         org.razon_social          ?? '',
        tipo_organizacion:    org.tipo_organizacion      ?? '',
        tipologia:            org.tipologia              ?? '',
        sector_cultural:      org.sector_cultural        ?? '',
        municipio:            org.municipio              ?? '',
        direccion:            org.direccion              ?? '',
        zona:                 org.zona                   ?? '',
        barrio:               org.barrio                 ?? '',
        comuna_corregimiento: org.comuna_corregimiento   ?? '',
        nombre_contacto:      org.nombre_contacto        ?? '',
        cargo_contacto:       org.cargo_contacto         ?? '',
        telefono_1:           String(org.telefono_1 ?? ''),
        telefono_2:           String(org.telefono_2 ?? ''),
        correo:               org.correo                 ?? '',
        whatsapp:             String(org.whatsapp ?? ''),
        instagram:            org.instagram              ?? '',
        facebook:             org.facebook               ?? '',
        youtube:              org.youtube                ?? '',
        foto_url:             org.foto_url               ?? '',
      });
      if (org.foto_url) setFotoPreview(org.foto_url);

      // Cuenta regresiva 60 s para reenvío
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; });
      }, 1000);

      setStage('codigo');

    } catch (err: any) {
      setError('Ocurrió un error inesperado. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ── PASO B: verificar código ─────────────────────────────────────────
  const handleVerificarCodigo = async () => {
    const codigo = codigoInput.trim();
    if (codigo.length !== 6) { setError('Ingresa el código de 6 dígitos.'); return; }
    setError('');
    setLoading(true);
    try {
      const { data: registros, error: checkError } = await supabase
        .from('codigos_verificacion')
        .select('id')
        .eq('correo', correoVerificado)
        .eq('codigo', codigo)
        .eq('usado', false)
        .gt('expires_at', new Date().toISOString())
        .limit(1);

      if (checkError || !registros?.length) {
        setError('Código incorrecto o expirado. Solicita uno nuevo.');
        setLoading(false);
        return;
      }

      await supabase
        .from('codigos_verificacion')
        .update({ usado: true })
        .eq('id', registros[0].id);

      setStage('form');
    } catch {
      setError('Error al verificar el código. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ── Subida de foto ───────────────────────────────────────────────────
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
        .from('organizaciones-fotos').upload(fileName, file, { upsert: false });
      if (uploadError) throw new Error(uploadError.message);
      const { data: urlData } = supabase.storage.from('organizaciones-fotos').getPublicUrl(fileName);
      setForm((prev) => ({ ...prev, foto_url: urlData.publicUrl }));
    } catch {
      setError('Error al subir la imagen. Intenta de nuevo.');
      setFotoPreview(null);
    } finally {
      setUploadingFoto(false);
    }
  };

  // ── Guardar cambios ──────────────────────────────────────────────────
  const handleGuardar = async () => {
    setLoading(true);
    setError('');
    try {
      const { error: updateError } = await supabase
        .from('organizaciones_culturales')
        .update({
          razon_social:         form.razon_social,
          tipo_organizacion:    form.tipo_organizacion,
          tipologia:            form.tipologia,
          sector_cultural:      form.sector_cultural,
          municipio:            form.municipio,
          direccion:            form.direccion,
          zona:                 form.zona,
          barrio:               form.barrio,
          comuna_corregimiento: form.comuna_corregimiento,
          nombre_contacto:      form.nombre_contacto,
          cargo_contacto:       form.cargo_contacto,
          telefono_1:           form.telefono_1,
          telefono_2:           form.telefono_2,
          correo:               form.correo,
          whatsapp:             form.whatsapp,
          instagram:            form.instagram,
          facebook:             form.facebook,
          youtube:              form.youtube,
          foto_url:             form.foto_url,
          actualizado_en:       new Date().toISOString(),
        })
        .eq('id', orgId);

      if (updateError) throw new Error(updateError.message);
      setStage('success');
    } catch {
      setError('Error al guardar los cambios. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ── UI helpers ───────────────────────────────────────────────────────
  const ErrorBox = ({ msg }: { msg: string }) => (
    <div className="flex gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
      <span className="shrink-0 mt-0.5">⚠️</span><span>{msg}</span>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════
  // ETAPA: email
  // ════════════════════════════════════════════════════════════════════
  if (stage === 'email') return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1E2B5C] mb-5">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#1E2B5C] mb-2">Actualiza tu información</h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          Ingresa el correo con el que registraste tu organización y te enviaremos un código de verificación.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="email-input" className="text-sm font-medium text-gray-700">Correo electrónico</Label>
          <Input
            id="email-input" type="email" value={emailInput}
            onChange={(e) => { setEmailInput(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleEnviarCodigo()}
            placeholder="contacto@tuorganizacion.com"
            className="mt-1.5 h-11 rounded-xl border-gray-200 focus:border-[#F47920] focus:ring-[#F47920]/20"
          />
        </div>
        {error && <ErrorBox msg={error} />}
        <Button
          onClick={handleEnviarCodigo}
          disabled={loading || !emailInput.trim()}
          className="w-full h-11 bg-[#F47920] hover:bg-[#d4621a] rounded-xl font-semibold"
        >
          {loading
            ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Verificando...</span>
            : <span className="flex items-center gap-2">Enviar código <ArrowRight className="w-4 h-4" /></span>
          }
        </Button>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════
  // ETAPA: codigo
  // ════════════════════════════════════════════════════════════════════
  if (stage === 'codigo') return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F47920] mb-5">
          <KeyRound className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#1E2B5C] mb-2">Revisa tu correo</h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          Enviamos un código a <span className="font-semibold text-[#1E2B5C]">{correoVerificado}</span>.
          Revisa también la carpeta de spam.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="codigo-input" className="text-sm font-medium text-gray-700">Código de 6 dígitos</Label>
          <Input
            id="codigo-input" value={codigoInput}
            onChange={(e) => { setCodigoInput(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleVerificarCodigo()}
            placeholder="000000" maxLength={6}
            className="mt-1.5 h-14 text-center text-3xl tracking-[0.6em] font-mono rounded-xl border-gray-200 focus:border-[#F47920]"
          />
          <p className="text-xs text-gray-400 mt-1.5 text-center">Expira en 15 minutos</p>
        </div>
        {error && <ErrorBox msg={error} />}
        <Button
          onClick={handleVerificarCodigo}
          disabled={loading || codigoInput.length !== 6}
          className="w-full h-11 bg-[#F47920] hover:bg-[#d4621a] rounded-xl font-semibold"
        >
          {loading
            ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Verificando...</span>
            : <span className="flex items-center gap-2">Continuar <ArrowRight className="w-4 h-4" /></span>
          }
        </Button>
        <div className="flex items-center justify-between pt-1">
          <button onClick={() => { setStage('email'); setCodigoInput(''); setError(''); }}
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Cambiar correo
          </button>
          {countdown > 0
            ? <span className="text-sm text-gray-400">Reenviar en <span className="font-semibold text-[#1E2B5C]">{countdown}s</span></span>
            : <button onClick={() => { setStage('email'); setCodigoInput(''); setError(''); }}
                className="text-sm text-[#F47920] hover:text-[#d4621a] flex items-center gap-1 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Nuevo código
              </button>
          }
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════
  // ETAPA: form — edición multi-paso
  // ════════════════════════════════════════════════════════════════════
  if (stage === 'form') return (
    <div className="max-w-2xl mx-auto px-6 py-10">

      {/* Banner verificado */}
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl mb-8">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-green-800 truncate">{orgNombre}</p>
          <p className="text-xs text-green-600">{correoVerificado} · Identidad verificada</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {FORM_STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive    = formStep === s.number;
          const isCompleted = formStep > s.number;
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
                <div className={`flex-1 h-px mx-3 mb-4 transition-all ${
                  formStep > s.number ? 'bg-[#F47920]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-8">

          {/* PASO 1 */}
          {formStep === 1 && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-[#1E2B5C] pb-3 border-b border-gray-100">Datos de la Organización</h3>
              <div>
                <Label htmlFor="u-rs" className="text-sm font-medium text-gray-700">Razón Social *</Label>
                <Input id="u-rs" value={form.razon_social} onChange={set('razon_social')} className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Sector Cultural *</Label>
                <Select value={form.sector_cultural} onValueChange={setSelect('sector_cultural')}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Selecciona el sector" /></SelectTrigger>
                  <SelectContent>{SECTORES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Tipo de Organización</Label>
                  <Select value={form.tipo_organizacion} onValueChange={setSelect('tipo_organizacion')}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Tipo" /></SelectTrigger>
                    <SelectContent>{TIPOS_ORGANIZACION.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Tipología</Label>
                  <Select value={form.tipologia} onValueChange={setSelect('tipologia')}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Tipología" /></SelectTrigger>
                    <SelectContent>{TIPOLOGIAS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {formStep === 2 && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-[#1E2B5C] pb-3 border-b border-gray-100">Ubicación y Contacto</h3>
              <div>
                <Label className="text-sm font-medium text-gray-700">Municipio *</Label>
                <Select value={form.municipio} onValueChange={setSelect('municipio')}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Selecciona el municipio" /></SelectTrigger>
                  <SelectContent>{MUNICIPIOS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="u-dir" className="text-sm font-medium text-gray-700">Dirección</Label>
                <Input id="u-dir" value={form.direccion} onChange={set('direccion')} className="mt-1.5 rounded-xl" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="u-zona" className="text-sm font-medium text-gray-700">Zona</Label>
                  <Input id="u-zona" value={form.zona} onChange={set('zona')} className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="u-barrio" className="text-sm font-medium text-gray-700">Barrio</Label>
                  <Input id="u-barrio" value={form.barrio} onChange={set('barrio')} className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="u-comuna" className="text-sm font-medium text-gray-700">Comuna / Corregimiento</Label>
                  <Input id="u-comuna" value={form.comuna_corregimiento} onChange={set('comuna_corregimiento')} className="mt-1.5 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="u-nc" className="text-sm font-medium text-gray-700">Persona de Contacto</Label>
                  <Input id="u-nc" value={form.nombre_contacto} onChange={set('nombre_contacto')} className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="u-cc" className="text-sm font-medium text-gray-700">Cargo</Label>
                  <Input id="u-cc" value={form.cargo_contacto} onChange={set('cargo_contacto')} className="mt-1.5 rounded-xl" />
                </div>
              </div>
              <div>
                <Label htmlFor="u-correo" className="text-sm font-medium text-gray-700">
                  Correo *{' '}
                  <span className="text-xs text-gray-400 font-normal">(si lo cambias, úsalo para futuras verificaciones)</span>
                </Label>
                <Input id="u-correo" type="email" value={form.correo} onChange={set('correo')} className="mt-1.5 rounded-xl" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="u-t1" className="text-sm font-medium text-gray-700">Teléfono 1 *</Label>
                  <Input id="u-t1" type="tel" value={form.telefono_1} onChange={set('telefono_1')} className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="u-t2" className="text-sm font-medium text-gray-700">Teléfono 2</Label>
                  <Input id="u-t2" type="tel" value={form.telefono_2} onChange={set('telefono_2')} className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="u-wa" className="text-sm font-medium text-gray-700">WhatsApp</Label>
                  <Input id="u-wa" type="tel" value={form.whatsapp} onChange={set('whatsapp')} className="mt-1.5 rounded-xl" />
                </div>
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {formStep === 3 && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-[#1E2B5C] pb-3 border-b border-gray-100">Foto y Redes Sociales</h3>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Foto{' '}<span className="text-xs text-gray-400 font-normal">JPG o PNG · máx. 2MB</span>
                </Label>
                {!fotoPreview ? (
                  <label htmlFor="u-foto" className={`mt-2 flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    uploadingFoto ? 'border-[#F47920] bg-[#F47920]/5' : 'border-gray-200 hover:border-[#F47920]/60 hover:bg-orange-50'
                  }`}>
                    {uploadingFoto
                      ? <div className="flex flex-col items-center gap-2 text-[#F47920]">
                          <div className="w-7 h-7 border-2 border-[#F47920] border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm">Subiendo...</span>
                        </div>
                      : <div className="flex flex-col items-center gap-1.5 text-gray-400">
                          <Upload className="w-7 h-7" />
                          <span className="text-sm">Clic para cambiar la foto</span>
                        </div>
                    }
                    <input id="u-foto" type="file" accept="image/*" className="hidden" onChange={handleFotoChange} disabled={uploadingFoto} />
                  </label>
                ) : (
                  <div className="mt-2 relative w-full h-36 rounded-xl overflow-hidden border border-gray-200">
                    <Image src={fotoPreview} alt="Preview" fill className="object-cover" />
                    <button onClick={() => { setFotoPreview(null); setForm((p) => ({ ...p, foto_url: '' })); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center">
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-400" /> Imagen cargada
                    </div>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="u-ig" className="text-sm font-medium text-gray-700">Instagram</Label>
                <Input id="u-ig" value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/tuorganizacion" className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="u-fb" className="text-sm font-medium text-gray-700">Facebook</Label>
                <Input id="u-fb" value={form.facebook} onChange={set('facebook')} placeholder="https://facebook.com/tuorganizacion" className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="u-yt" className="text-sm font-medium text-gray-700">YouTube</Label>
                <Input id="u-yt" value={form.youtube} onChange={set('youtube')} placeholder="https://youtube.com/@tuorganizacion" className="mt-1.5 rounded-xl" />
              </div>
              {error && <ErrorBox msg={error} />}
            </div>
          )}

          {/* Navegación */}
          <div className={`flex mt-8 pt-6 border-t border-gray-100 ${formStep > 1 ? 'justify-between' : 'justify-end'}`}>
            {formStep > 1 && (
              <Button variant="outline" onClick={() => setFormStep(formStep - 1)} disabled={loading}
                className="border-gray-200 text-gray-600 rounded-xl">
                <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
              </Button>
            )}
            {formStep < 3
              ? <Button onClick={() => setFormStep(formStep + 1)} disabled={!canNextForm()}
                  className="bg-[#1E2B5C] hover:bg-[#2d3f7a] rounded-xl px-6">
                  Siguiente <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              : <Button onClick={handleGuardar} disabled={loading || uploadingFoto}
                  className="bg-[#F47920] hover:bg-[#d4621a] rounded-xl px-8 font-semibold">
                  {loading
                    ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Guardando...</span>
                    : 'Guardar cambios'}
                </Button>
            }
          </div>

        </CardContent>
      </Card>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════
  // ETAPA: success
  // ════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-[#1E2B5C] mb-3">¡Información actualizada!</h2>
      <p className="text-gray-500 leading-relaxed mb-8">
        Los cambios de{' '}
        <span className="font-semibold text-[#1E2B5C]">{orgNombre}</span>{' '}
        ya están visibles en el directorio cultural de Caldas.
      </p>
      <Button variant="outline" onClick={resetFlow} className="border-gray-200 text-gray-600 rounded-xl">
        Actualizar otra organización
      </Button>
    </div>
  );
}