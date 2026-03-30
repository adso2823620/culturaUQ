'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import Breadcrumb from '@/components/Breadcrumb';
import InscribeteForm from '@/components/asociate/InscribeteForm';
import ActualizaInfoForm from '@/components/asociate/ActualizaInfoForm';
import RegistraEventoForm from '@/components/asociate/RegistraEventoForm';
import Link from 'next/link';
import { UserPlus, RefreshCw, CalendarPlus, ChevronRight } from 'lucide-react';

type Tab = 'inscribete' | 'actualiza' | 'eventos';

const OPCIONES = [
  {
    id: 'inscribete' as Tab,
    label: 'Inscríbete',
    descripcion: 'Registra tu organización en el directorio cultural de Caldas',
    icon: UserPlus,
    accent: '#e63947',
    accentBg: 'rgba(230,57,71,0.08)',
  },
  {
    id: 'actualiza' as Tab,
    label: 'Actualiza tu info',
    descripcion: 'Edita tus datos, foto y redes con verificación por correo',
    icon: RefreshCw,
    accent: '#0f4c75',
    accentBg: 'rgba(15,76,117,0.08)',
  },
  {
    id: 'eventos' as Tab,
    label: 'Registra un evento',
    descripcion: 'Publica tus próximos eventos en la Agenda Cultural de Caldas',
    icon: CalendarPlus,
    accent: '#2d9b6f',
    accentBg: 'rgba(45,155,111,0.08)',
  },
]

const TABS_NAV = [
  { slug: 'agenda', label: 'Agenda Cultural' },
  { slug: 'conectate', label: 'Conéctate' },
  { slug: 'asociate', label: 'Asóciate' },
]

export default function AsociatePage() {
  const [tab, setTab] = useState<Tab | null>(null)
  const opcionActiva = OPCIONES.find(o => o.id === tab)

  return (
    <PageLayout letter="A" letterPosition="top-right">

      {/* Breadcrumb + tabs nav */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <Breadcrumb crumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Caldas Cultural', href: '/caldas-cultural' },
          { label: 'Asóciate' },
        ]} />
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
          {TABS_NAV.map(t => (
            <Link key={t.slug} href={`/caldas-cultural/${t.slug}`}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: t.slug === 'asociate' ? '#0f4c75' : 'transparent',
                color: t.slug === 'asociate' ? 'white' : '#6b7280',
              }}>
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Hero suave */}
      <div className="max-w-5xl mx-auto px-6 pb-6">
        <div className="mb-2">
          <span className="inline-block bg-[#e63947]/10 text-[#e63947] text-xs tracking-widest px-4 py-1.5 rounded-full mb-4">
            CALDAS CULTURAL
          </span>
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#0f4c75' }}>
            Asóciate
          </h1>
          <p className="text-gray-500 text-base max-w-lg leading-relaxed">
            Sé parte del directorio cultural de Caldas. ¿Qué necesitas hacer hoy?
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Lista de opciones — columna izquierda */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {OPCIONES.map(opcion => {
              const Icon = opcion.icon
              const isActive = tab === opcion.id
              return (
                <button
                  key={opcion.id}
                  onClick={() => setTab(opcion.id)}
                  className="w-full text-left transition-all duration-200 rounded-2xl group"
                  style={{
                    background: isActive ? opcion.accentBg : 'white',
                    border: isActive ? `2px solid ${opcion.accent}` : '1px solid #e5e7eb',
                    padding: '16px 20px',
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Ícono */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                      style={{
                        backgroundColor: isActive ? opcion.accent : '#f3f4f6',
                      }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: isActive ? 'white' : '#9ca3af' }}
                      />
                    </div>

                    {/* Texto */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold leading-none mb-1 transition-colors duration-200"
                        style={{ color: isActive ? opcion.accent : '#111827' }}
                      >
                        {opcion.label}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>
                        {opcion.descripcion}
                      </p>
                    </div>

                    {/* Flecha */}
                    <ChevronRight
                      className="w-4 h-4 flex-shrink-0 transition-all duration-200"
                      style={{
                        color: isActive ? opcion.accent : '#d1d5db',
                        transform: isActive ? 'translateX(2px)' : 'none',
                      }}
                    />
                  </div>
                </button>
              )
            })}

            {/* Info de ayuda */}
            <div className="mt-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs text-gray-400 leading-relaxed">
                💡 Tu información quedará pendiente de aprobación antes de aparecer en el directorio público.
              </p>
            </div>
          </div>

          {/* Panel del formulario — columna derecha */}
          <div className="lg:col-span-3">
            {!tab ? (
              /* Estado inicial — ninguna opción seleccionada */
              <div className="h-full min-h-64 flex flex-col items-center justify-center text-center p-10 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">
                  Selecciona una opción
                </p>
                <p className="text-gray-300 text-xs">
                  Elige qué quieres hacer en el panel de la izquierda
                </p>
              </div>
            ) : (
              /* Formulario activo */
              <div
                className="bg-white rounded-2xl border overflow-hidden"
                style={{ borderColor: opcionActiva?.accent + '30' }}
              >
                {/* Header del formulario */}
                <div
                  className="px-6 py-4 border-b flex items-center gap-3"
                  style={{
                    backgroundColor: opcionActiva?.accentBg,
                    borderColor: opcionActiva?.accent + '20',
                  }}
                >
                  {opcionActiva && (
                    <>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: opcionActiva.accent }}
                      >
                        <opcionActiva.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: opcionActiva.accent }}>
                          {opcionActiva.label}
                        </p>
                        <p className="text-xs text-gray-400">{opcionActiva.descripcion}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Formulario */}
                <div>
                  {tab === 'inscribete' && <InscribeteForm />}
                  {tab === 'actualiza' && <ActualizaInfoForm />}
                  {tab === 'eventos' && <RegistraEventoForm />}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

    </PageLayout>
  );
}