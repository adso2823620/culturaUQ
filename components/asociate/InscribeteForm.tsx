'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, ChevronRight, ChevronLeft, Building2, MapPin, Share2, Upload, X } from 'lucide-react';

// ── Opciones ──────────────────────────────────────────────────────────
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

type FormData = {
  razon_social: string;
  tipo_organizacion: string;
  tipologia: string;
  sector_cultural: string;
  municipio: string;
  direccion: string;
  zona: string;
  barrio: string;
  comuna: string;
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

const initialForm: FormData = {
  razon_social: '', tipo_organizacion: '', tipologia: '', sector_cultural: '',
  municipio: '', direccion: '', zona: '', barrio: '', comuna: '',
  nombre_contacto: '', cargo_contacto: '', telefono_1: '', telefono_2: '',
  correo: '', whatsapp: '', instagram: '', facebook: '', youtube: '', foto_url: '',
};

const STEPS = [
  { number: 1, label: 'Organización',         icon: Building2 },
  { number: 2, label: 'Ubicación y Contacto', icon: MapPin },
  { number: 3, label: 'Foto y Redes',         icon: Share2 },
];

export default function InscribeteForm() {
  const [step, setStep]                   = useState(1);
  const [form, setForm]                   = useState<FormData>(initialForm);
  const [loading, setLoading]             = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [fotoPreview, setFotoPreview]     = useState<string | null>(null);
  const [submitted, setSubmitted]         = useState(false);
  const [error, setError]                 = useState('');

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: e.target.value });

  const setSelect = (field: keyof FormData) => (value: string) =>
    setForm({ ...form, [field]: value });

  const canNext = () => {
    if (step === 1) return form.razon_social.trim() !== '' && form.sector_cultural !== '';
    if (step === 2) return form.municipio !== '' && form.correo.trim() !== '' && form.telefono_1.trim() !== '';
    return true;
  };

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Solo se permiten imágenes (JPG, PNG, WebP).'); return; }
    if (file.size > 2 * 1024 * 1024) { setError('La imagen no puede superar 2MB.'); return; }
    setError('');
    setUploadingFoto(true);
    try {
      setFotoPreview(URL.createObjectURL(file));
      const ext      = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('solicitudes-fotos').upload(fileName, file, { upsert: false });
      if (uploadError) throw new Error(uploadError.message);
      const { data: urlData } = supabase.storage.from('solicitudes-fotos').getPublicUrl(fileName);
      setForm((prev) => ({ ...prev, foto_url: urlData.publicUrl }));
    } catch (err: any) {
      setError('Error al subir la imagen. Intenta de nuevo.');
      setFotoPreview(null);
    } finally {
      setUploadingFoto(false);
    }
  };

  const handleQuitarFoto = () => {
    setFotoPreview(null);
    setForm((prev) => ({ ...prev, foto_url: '' }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const { error: dbError } = await supabase
        .from('solicitudes_organizacion')
        .insert([form]);
      if (dbError) throw new Error(dbError.message);

      const { error: fnError } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'nueva_solicitud_org',
          to: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
          data: form,
        },
      });
      if (fnError) console.warn('Email al admin no enviado:', fnError.message);
      setSubmitted(true);
    } catch (err: any) {
      setError('Ocurrió un error al enviar tu solicitud. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ── Pantalla de éxito ───────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-24 h-24 bg-[#e63947]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-[#e63947]" />
        </div>
        <h2 className="text-4xl mb-4 text-[#2a9d8f]">¡Solicitud Enviada!</h2>
        <p className="text-lg text-[#6B7280] leading-relaxed max-w-md mx-auto mb-8">
          Tu organización ha sido registrada y está pendiente de aprobación.
          El equipo de Cultura Caldas revisará la información y te contactará
          al correo <strong className="text-[#2a9d8f]">{form.correo}</strong>.
        </p>
        <Button onClick={() => { setForm(initialForm); setStep(1); setSubmitted(false); setFotoPreview(null); }}>
          Registrar otra organización
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl mb-3 text-[#2a9d8f]">Inscríbete</h2>
        <p className="text-[#6B7280] leading-relaxed">
          Registra tu organización en el directorio cultural de Caldas.
          Tu solicitud será revisada por nuestro equipo.
        </p>
      </div>

      {/* Indicador de pasos */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => {
          const Icon        = s.icon;
          const isActive    = step === s.number;
          const isCompleted = step > s.number;
          return (
            <div key={s.number} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted ? 'bg-[#e63947] text-white'
                  : isActive  ? 'bg-[#2a9d8f] text-white'
                              : 'bg-gray-100 text-gray-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-xs mt-1 text-center hidden sm:block ${
                  isActive ? 'text-[#2a9d8f] font-semibold' : 'text-gray-400'
                }`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all duration-300 ${
                  step > s.number ? 'bg-[#e63947]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      <Card className="border border-[#e63947]/20">
        <CardContent className="p-8">

          {/* ── PASO 1 ── */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-xl text-[#2a9d8f] mb-6 pb-2 border-b border-[#e63947]/20">
                Datos de la Organización
              </h3>
              <div>
                <Label htmlFor="razon_social">Razón Social / Nombre *</Label>
                <Input id="razon_social" value={form.razon_social} onChange={set('razon_social')}
                  placeholder="Nombre oficial de tu organización" />
              </div>
              <div>
                <Label>Sector Cultural *</Label>
                <Select value={form.sector_cultural} onValueChange={setSelect('sector_cultural')}>
                  <SelectTrigger><SelectValue placeholder="Selecciona el sector" /></SelectTrigger>
                  <SelectContent>{SECTORES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipo de Organización</Label>
                <Select value={form.tipo_organizacion} onValueChange={setSelect('tipo_organizacion')}>
                  <SelectTrigger><SelectValue placeholder="Selecciona el tipo" /></SelectTrigger>
                  <SelectContent>{TIPOS_ORGANIZACION.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipología</Label>
                <Select value={form.tipologia} onValueChange={setSelect('tipologia')}>
                  <SelectTrigger><SelectValue placeholder="Selecciona la tipología" /></SelectTrigger>
                  <SelectContent>{TIPOLOGIAS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* ── PASO 2 ── */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-xl text-[#2a9d8f] mb-6 pb-2 border-b border-[#e63947]/20">
                Ubicación y Contacto
              </h3>
              <div>
                <Label>Municipio *</Label>
                <Select value={form.municipio} onValueChange={setSelect('municipio')}>
                  <SelectTrigger><SelectValue placeholder="Selecciona el municipio" /></SelectTrigger>
                  <SelectContent>{MUNICIPIOS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" value={form.direccion} onChange={set('direccion')} placeholder="Calle 23 #45-67" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label htmlFor="zona">Zona</Label><Input id="zona" value={form.zona} onChange={set('zona')} placeholder="Urbana" /></div>
                <div><Label htmlFor="barrio">Barrio</Label><Input id="barrio" value={form.barrio} onChange={set('barrio')} /></div>
                <div><Label htmlFor="comuna">Comuna</Label><Input id="comuna" value={form.comuna} onChange={set('comuna')} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="nombre_contacto">Persona de Contacto</Label><Input id="nombre_contacto" value={form.nombre_contacto} onChange={set('nombre_contacto')} /></div>
                <div><Label htmlFor="cargo_contacto">Cargo</Label><Input id="cargo_contacto" value={form.cargo_contacto} onChange={set('cargo_contacto')} /></div>
              </div>
              <div>
                <Label htmlFor="correo">
                  Correo Electrónico *{' '}
                  <span className="text-xs text-[#6B7280] font-normal">(este correo se usará para identificarte)</span>
                </Label>
                <Input id="correo" type="email" value={form.correo} onChange={set('correo')} placeholder="contacto@tuorganizacion.com" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label htmlFor="telefono_1">Teléfono Principal *</Label><Input id="telefono_1" type="tel" value={form.telefono_1} onChange={set('telefono_1')} /></div>
                <div><Label htmlFor="telefono_2">Teléfono Secundario</Label><Input id="telefono_2" type="tel" value={form.telefono_2} onChange={set('telefono_2')} /></div>
                <div><Label htmlFor="whatsapp">WhatsApp</Label><Input id="whatsapp" type="tel" value={form.whatsapp} onChange={set('whatsapp')} /></div>
              </div>
            </div>
          )}

          {/* ── PASO 3 ── */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl text-[#2a9d8f] mb-6 pb-2 border-b border-[#e63947]/20">
                Foto y Redes Sociales
              </h3>
              <div>
                <Label>Foto de la Organización <span className="text-xs text-[#6B7280] font-normal">(JPG o PNG, máx. 2MB)</span></Label>
                {!fotoPreview ? (
                  <label htmlFor="foto-upload" className={`mt-2 flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ${
                    uploadingFoto ? 'border-[#e63947]/50 bg-[#e63947]/5' : 'border-gray-200 bg-gray-50 hover:border-[#e63947]/50 hover:bg-[#e63947]/5'
                  }`}>
                    {uploadingFoto ? (
                      <div className="flex flex-col items-center gap-2 text-[#e63947]">
                        <div className="w-8 h-8 border-2 border-[#e63947] border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Subiendo imagen...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Upload className="w-8 h-8" />
                        <span className="text-sm">Haz clic para subir tu foto</span>
                        <span className="text-xs">JPG, PNG o WebP — máx. 2MB</span>
                      </div>
                    )}
                    <input id="foto-upload" type="file" accept="image/*" className="hidden" onChange={handleFotoChange} disabled={uploadingFoto} />
                  </label>
                ) : (
                  <div className="mt-2 relative w-full h-40 rounded-xl overflow-hidden border border-[#e63947]/30">
                    <Image src={fotoPreview} alt="Preview" fill className="object-cover" />
                    <button onClick={handleQuitarFoto} className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-400" /> Imagen cargada
                    </div>
                  </div>
                )}
              </div>
              <div><Label htmlFor="instagram">Instagram</Label><Input id="instagram" value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/tuorganizacion" /></div>
              <div><Label htmlFor="facebook">Facebook</Label><Input id="facebook" value={form.facebook} onChange={set('facebook')} placeholder="https://facebook.com/tuorganizacion" /></div>
              <div><Label htmlFor="youtube">YouTube</Label><Input id="youtube" value={form.youtube} onChange={set('youtube')} placeholder="https://youtube.com/@tuorganizacion" /></div>

              {/* Resumen */}
              <div className="p-5 bg-[#e63947]/5 rounded-xl border border-[#e63947]/20">
                <p className="text-sm font-semibold text-[#2a9d8f] mb-3">Resumen de tu solicitud:</p>
                <div className="space-y-1.5 text-sm text-[#6B7280]">
                  <p><span className="text-[#2a9d8f] font-medium">Organización:</span> {form.razon_social}</p>
                  <p><span className="text-[#2a9d8f] font-medium">Sector:</span> {form.sector_cultural}</p>
                  <p><span className="text-[#2a9d8f] font-medium">Municipio:</span> {form.municipio}</p>
                  <p><span className="text-[#2a9d8f] font-medium">Correo:</span> {form.correo}</p>
                  <p><span className="text-[#2a9d8f] font-medium">Foto:</span>{' '}
                    {form.foto_url ? <span className="text-green-600">✓ Cargada</span> : <span className="text-gray-400">Sin foto</span>}
                  </p>
                </div>
              </div>

              {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
            </div>
          )}

          {/* Navegación */}
          <div className={`flex mt-8 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={loading} className="border-[#2a9d8f]/30 text-[#2a9d8f]">
                <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
                Siguiente <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading || uploadingFoto} className="px-8">
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </Button>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
