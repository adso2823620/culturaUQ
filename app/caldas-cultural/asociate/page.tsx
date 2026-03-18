'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import InscribeteForm from '@/components/asociate/InscribeteForm';
import ActualizaInfoForm from '@/components/asociate/ActualizaInfoForm';
import RegistraEventoForm from '@/components/asociate/RegistraEventoForm';
import { UserPlus, RefreshCw, CalendarPlus, ChevronRight } from 'lucide-react';

type Tab = 'inscribete' | 'actualiza' | 'eventos';

const TABS = [
  {
    id: 'inscribete' as Tab,
    label: 'Inscríbete',
    sublabel: 'Organización nueva',
    descripcion: 'Registra tu organización en el directorio cultural de Caldas.',
    icon: UserPlus,
    accent: '#e63947',
    accentBg: 'bg-[#e63947]',
    accentText: 'text-[#e63947]',
  },
  {
    id: 'actualiza' as Tab,
    label: 'Actualiza tu info',
    sublabel: 'Ya estás registrado',
    descripcion: 'Edita tus datos, foto y redes. Solo necesitas tu correo registrado.',
    icon: RefreshCw,
    accent: '#0f4c75',
    accentBg: 'bg-[#0f4c75]',
    accentText: 'text-[#0f4c75]',
  },
  {
    id: 'eventos' as Tab,
    label: 'Registra un evento',
    sublabel: 'Agenda cultural',
    descripcion: 'Publica tus próximos eventos para que aparezcan en la Agenda de Caldas.',
    icon: CalendarPlus,
    accent: '#2d9b6f',
    accentBg: 'bg-[#2d9b6f]',
    accentText: 'text-[#2d9b6f]',
  },
] as const;

export default function AsociatePage() {
  const [tab, setTab] = useState<Tab>('inscribete');
  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <PageLayout letter="A" letterPosition="top-right">

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <div className="relative bg-[#2a9d8f] overflow-hidden">

        {/* Patrón puntitos */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
        />
        {/* Orbes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#e63947]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-[#0f4c75]/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-12">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#e63947]/15 border border-[#e63947]/25 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e63947] animate-pulse" />
            <span className="text-[#e63947] text-xs tracking-widest font-semibold uppercase">Caldas Cultural</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 leading-tight">Asóciate</h1>
          <p className="text-white/50 text-base max-w-lg leading-relaxed">
            Sé parte del directorio cultural de Caldas. Elige qué quieres hacer:
          </p>

          {/* Tarjetas de selección */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            {TABS.map((t) => {
              const Icon     = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`group relative text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-white/10 shadow-lg shadow-black/20'
                      : 'border-white/10 bg-white/5 hover:border-white/25'
                  }`}
                  style={isActive ? { borderColor: t.accent } : undefined}
                >
                  {isActive && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full"
                      style={{ backgroundColor: t.accent }} />
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                    isActive ? t.accentBg : 'bg-white/10 group-hover:bg-white/15'
                  }`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                    isActive ? t.accentText : 'text-white/40'
                  }`}>{t.sublabel}</p>
                  <p className={`text-base font-bold mb-2 ${
                    isActive ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                  }`}>{t.label}</p>
                  <p className={`text-xs leading-relaxed ${
                    isActive ? 'text-white/60' : 'text-white/30 group-hover:text-white/45'
                  }`}>{t.descripcion}</p>
                  {isActive && (
                    <div className={`flex items-center gap-1 mt-4 text-xs font-semibold ${t.accentText}`}>
                      Seleccionado <ChevronRight className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Línea de color activo */}
        <div className="h-1 w-full transition-all duration-500" style={{ backgroundColor: activeTab.accent }} />
      </div>

      {/* ── CONTENIDO ───────────────────────────────────────────────── */}
      <div className="bg-gray-50 min-h-screen">
        {tab === 'inscribete' && <InscribeteForm />}
        {tab === 'actualiza'  && <ActualizaInfoForm />}
        {tab === 'eventos'    && <RegistraEventoForm />}
      </div>

    </PageLayout>
  );
}
