'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PageLayout from '@/components/PageLayout';
import SectoresCulturales from '@/components/SectoresCulturales';
import InscribeteForm from '@/components/asociate/InscribeteForm';
import { Map, Users, X } from 'lucide-react';

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
    <div className="fixed inset-0 flex items-start justify-center pt-8 pb-8 px-4 overflow-y-auto"
      style={{ zIndex: 999 }} onClick={onClose}>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-gray-50 rounded-2xl w-full max-w-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-lg font-semibold text-[#2a9d8f]">Registrar mi organización</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Completa el formulario para aparecer en el mapa y el directorio</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
        <div className="p-4"><InscribeteForm /></div>
      </div>
    </div>,
    document.body
  );
}

export default function ConexionCulturalPage() {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <PageLayout letter="M" letterPosition="top-right" bgImage="imgfondo.png">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* ── Hero — patrón Labter ── */}
        <div className="mb-16 text-center">
          <span className="inline-block bg-[#e63947]/10 text-[#e63947] text-xs tracking-widest px-4 py-1.5 rounded-full mb-4">
            SISTEMA DE INFORMACIÓN
          </span>
          <h1 className="text-5xl font-bold text-[#2a9d8f] mb-5">Conexión Cultural</h1>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto leading-relaxed">
            Explora el mapa interactivo de organizaciones y espacios culturales de Caldas.
            Descubre, conecta y colabora con la comunidad cultural del departamento.
          </p>
        </div>

        {/* ── Mapa — card estilo Labter ── */}
        <div className="relative rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl transition-all duration-300 mb-14">
          <div className="h-1 w-full bg-[#2a9d8f]" />
          <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#2a9d8f]/10">
                <Map className="w-5 h-5 text-[#2a9d8f]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2a9d8f]">Mapa Interactivo de Organizaciones</p>
                <p className="text-xs text-[#6B7280]">Haz clic en los marcadores para ver información</p>
              </div>
            </div>
            <a href="https://mapa-fong.web.app" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 border border-[#2a9d8f]/30 text-[#2a9d8f] rounded-full text-xs
                hover:bg-[#2a9d8f] hover:text-white transition-all duration-200 font-medium">
              Pantalla completa ↗
            </a>
          </div>
          <div className="w-full" style={{ height: '560px' }}>
            <iframe src="https://mapa-fong.web.app" className="w-full h-full border-0"
              title="Mapa Organizaciones Culturales de Caldas" loading="lazy" allowFullScreen />
          </div>
        </div>

        {/* ── Sectores Culturales ── */}
        <div className="mb-14 -mx-6">
          <SectoresCulturales />
        </div>

        {/* ── Registro — card estilo Labter ── */}
        <div className="relative rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="h-1 w-full bg-[#e63947]" />
          <div className="p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block bg-[#e63947]/10 text-[#e63947] text-xs tracking-widest px-4 py-1.5 rounded-full mb-5">
                  REGISTRO GRATUITO
                </span>
                <h2 className="text-3xl font-bold text-[#2a9d8f] mb-4 leading-snug">
                  ¿Quieres aparecer<br />en el mapa?
                </h2>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
                  Si eres una organización cultural, colectivo, espacio o gestor en Caldas,
                  regístrate para ser parte del directorio y conectar con la comunidad.
                </p>
                <div className="space-y-3 mb-7">
                  {[
                    { n: '1', txt: 'Completa el formulario con la información de tu organización' },
                    { n: '2', txt: 'Nuestro equipo revisa y valida los datos' },
                    { n: '3', txt: 'Apareces en el mapa, el directorio y la plataforma' },
                  ].map(s => (
                    <div key={s.n} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#e63947] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{s.n}</span>
                      </div>
                      <p className="text-[#6B7280] text-sm leading-relaxed">{s.txt}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setModalAbierto(true)}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-[#e63947] text-white rounded-full
                    hover:bg-[#e63947]/90 transition-all duration-200 font-medium text-sm shadow-sm hover:-translate-y-0.5">
                  <Users className="w-4 h-4" />
                  Registrar mi organización
                </button>
              </div>
              <div className="hidden md:block">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 space-y-3">
                  <p className="text-xs font-semibold text-[#6B7280] tracking-widest uppercase mb-4">Tu perfil incluye</p>
                  {[
                    { icon: '🏛️', txt: 'Nombre y tipo de organización' },
                    { icon: '📍', txt: 'Ubicación en el mapa interactivo' },
                    { icon: '📞', txt: 'Datos de contacto y redes sociales' },
                    { icon: '🎨', txt: 'Sector y tipología cultural' },
                    { icon: '📸', txt: 'Foto de tu organización' },
                    { icon: '✅', txt: 'Badge de verificación (tras revisión)' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-[#6B7280] text-sm">{item.txt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {modalAbierto && <ModalRegistro onClose={() => setModalAbierto(false)} />}
    </PageLayout>
  );
}