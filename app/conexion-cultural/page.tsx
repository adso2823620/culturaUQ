'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from '@/components/ui/card';
import PageLayout from '@/components/PageLayout';
import SectoresCulturales from '@/components/SectoresCulturales';
import InscribeteForm from '@/components/asociate/InscribeteForm';
import { Map, Users, X } from 'lucide-react';





// ── Modal de registro ─────────────────────────────────────────────────────────
function ModalRegistro({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 flex items-start justify-center pt-8 pb-8 px-4 overflow-y-auto"
      style={{ zIndex: 999 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative bg-gray-50 rounded-2xl w-full max-w-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-lg font-semibold text-[#1E2B5C]">Registrar mi organización</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Completa el formulario para aparecer en el mapa y el directorio
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Formulario existente — reutilizado sin cambios */}
        <div className="p-4">
          <InscribeteForm />
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function ConexionCulturalPage() {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <PageLayout letter="M" letterPosition="top-right">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-[#3B82F6]/10 rounded-full mb-6">
            <span className="text-[#3B82F6] text-sm tracking-widest">SISTEMA DE INFORMACIÓN</span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Map className="w-10 h-10 text-[#F47920]" />
            <h1 className="text-5xl text-[#1E2B5C]">CONEXIÓN CULTURAL</h1>
          </div>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto leading-relaxed">
            Explora el mapa interactivo de organizaciones y espacios culturales de Caldas.
            Descubre, conecta y colabora con la comunidad cultural del departamento.
          </p>
        </div>

        {/* ── Mapa interactivo ── */}
        <Card className="mb-14 overflow-hidden border-2 border-[#F47920]/30 shadow-xl">
          <CardContent className="p-0">
            {/* Encabezado del mapa */}
            <div className="bg-gradient-to-r from-[#1E2B5C] to-[#2d3f8a] px-6 py-5 text-white">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Map className="w-5 h-5 text-[#F47920]" />
                    <h2 className="text-xl font-medium">Mapa Interactivo de Organizaciones</h2>
                  </div>
                  <p className="text-white/70 text-sm">
                    Haz clic en los marcadores para ver información de cada organización
                  </p>
                </div>
                <a
                  href="https://mapa-fong.web.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 px-5 py-2 border border-white/30 text-white rounded-full text-sm
                    hover:bg-white hover:text-[#1E2B5C] transition-all duration-200"
                >
                  Abrir pantalla completa ↗
                </a>
              </div>
            </div>

            {/* iframe */}
            <div className="w-full" style={{ height: '580px' }}>
              <iframe
                src="https://mapa-fong.web.app"
                className="w-full h-full border-0"
                title="Mapa de Organizaciones Culturales de Caldas"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Sectores Culturales — componente real con datos Supabase ── */}
        <div className="mb-14 -mx-6">
          <SectoresCulturales />
        </div>

        {/* ── ¿Quieres aparecer en el mapa? ── */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E2B5C] to-[#2d3f8a] p-10 md:p-14">

          {/* Patrón decorativo SVG de fondo */}
          <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              {[0,1,2,3,4,5,6,7].map(i => [0,1,2,3,4].map(j => (
                <circle key={`${i}-${j}`} cx={i*120-30} cy={j*100-20} r="40"
                  fill="none" stroke="#F47920" strokeWidth="1" />
              )))}
            </svg>
          </div>

          <div className="relative grid md:grid-cols-2 gap-10 items-center">

            {/* Texto */}
            <div className="text-white">
              <div className="inline-block px-4 py-1.5 bg-[#F47920]/20 border border-[#F47920]/30 rounded-full mb-5">
                <span className="text-[#F47920] text-xs tracking-widest font-medium">REGISTRO GRATUITO</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-medium mb-4 leading-snug">
                ¿Quieres aparecer <br />en el mapa?
              </h2>
              <p className="text-white/70 leading-relaxed mb-6 max-w-md">
                Si eres una organización cultural, colectivo artístico, espacio o gestor
                independiente en Caldas, regístrate para ser parte del directorio y
                conectar con toda la comunidad cultural del departamento.
              </p>

              {/* Pasos */}
              <div className="space-y-3 mb-8">
                {[
                  { n: '1', txt: 'Completa el formulario con la información de tu organización' },
                  { n: '2', txt: 'Nuestro equipo revisa y valida los datos' },
                  { n: '3', txt: 'Apareces en el mapa, el directorio y la plataforma' },
                ].map(step => (
                  <div key={step.n} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#F47920] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{step.n}</span>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">{step.txt}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setModalAbierto(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F47920] text-white rounded-full
                  hover:bg-[#fb923c] transition-all duration-200 font-medium shadow-lg shadow-[#F47920]/30
                  hover:shadow-[#F47920]/50 hover:-translate-y-0.5"
              >
                <Users className="w-5 h-5" />
                Registrar mi organización
              </button>
            </div>

            {/* Card decorativa derecha */}
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-[#F47920]" />
                  <span className="text-white/60 text-xs tracking-wide">INFORMACIÓN QUE INCLUYE TU PERFIL</span>
                </div>
                {[
                  { icon: '🏛️', txt: 'Nombre y tipo de organización' },
                  { icon: '📍', txt: 'Ubicación en el mapa interactivo' },
                  { icon: '📞', txt: 'Datos de contacto y redes sociales' },
                  { icon: '🎨', txt: 'Sector y tipología cultural' },
                  { icon: '📸', txt: 'Foto de tu organización' },
                  { icon: '✅', txt: 'Badge de verificación (tras revisión)' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-white/70 text-sm">{item.txt}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── Modal de registro ── */}
      {modalAbierto && (
        <ModalRegistro onClose={() => setModalAbierto(false)} />
      )}
    </PageLayout>
  );
}