// app/api/convocatorias/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Agrega convocatorias culturales desde múltiples fuentes RSS.
// Fuentes: Google News (queries específicos) + RSS directo de Alcaldía Manizales.
// Caché: 2 horas (las convocatorias cambian menos que las noticias).
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';

export const revalidate = 7200; // 2 horas

// ── Tipos ─────────────────────────────────────────────────────────────────────
export type TipoConvocatoria =
  | 'Beca'
  | 'Estímulo'
  | 'Formación'
  | 'Licitación'
  | 'Residencia'
  | 'Premio'
  | 'Concertación'
  | 'Convocatoria';

export type ConvocatoriaItem = {
  id: string;
  titulo: string;
  extracto: string;
  entidad: string;       // fuente / medio que publica
  url: string;
  fecha: string;         // ISO — fecha de publicación
  fechaLegible: string;
  tipo: TipoConvocatoria;
  ambito: 'Local' | 'Departamental' | 'Nacional';
};

// ── Feeds configurados ────────────────────────────────────────────────────────
// Mezcla de Google News (queries muy específicos) + RSS directos.
// Google News agrega resultados de La Patria, El Colombiano, centrodeinformacion, etc.
const FEEDS: { url: string; tipo: TipoConvocatoria; ambito: ConvocatoriaItem['ambito'] }[] = [
  // ── Google News: términos muy focalizados ──────────────────────────────────
  {
    url: 'https://news.google.com/rss/search?q=convocatoria+cultural+manizales+2026&hl=es-419&gl=CO&ceid=CO:es',
    tipo: 'Convocatoria',
    ambito: 'Local',
  },
  {
    url: 'https://news.google.com/rss/search?q=convocatoria+cultural+caldas+2026&hl=es-419&gl=CO&ceid=CO:es',
    tipo: 'Convocatoria',
    ambito: 'Departamental',
  },
  {
    url: 'https://news.google.com/rss/search?q=estimulos+culturales+manizales+caldas&hl=es-419&gl=CO&ceid=CO:es',
    tipo: 'Estímulo',
    ambito: 'Local',
  },
  {
    url: 'https://news.google.com/rss/search?q=becas+artes+cultura+colombia+2026&hl=es-419&gl=CO&ceid=CO:es',
    tipo: 'Beca',
    ambito: 'Nacional',
  },
  {
    url: 'https://news.google.com/rss/search?q=convocatoria+formacion+artistica+cultural+colombia&hl=es-419&gl=CO&ceid=CO:es',
    tipo: 'Formación',
    ambito: 'Nacional',
  },
  {
    url: 'https://news.google.com/rss/search?q=licitacion+contratacion+artistica+cultural+caldas+manizales&hl=es-419&gl=CO&ceid=CO:es',
    tipo: 'Licitación',
    ambito: 'Local',
  },
  {
    url: 'https://news.google.com/rss/search?q=residencia+artistica+colombia+convocatoria&hl=es-419&gl=CO&ceid=CO:es',
    tipo: 'Residencia',
    ambito: 'Nacional',
  },
  {
    url: 'https://news.google.com/rss/search?q=premio+cultural+colombia+convocatoria+2026&hl=es-419&gl=CO&ceid=CO:es',
    tipo: 'Premio',
    ambito: 'Nacional',
  },
  {
    url: 'https://news.google.com/rss/search?q=concertacion+cultural+mincultura+convocatoria&hl=es-419&gl=CO&ceid=CO:es',
    tipo: 'Concertación',
    ambito: 'Nacional',
  },
  // ── RSS directo: Alcaldía de Manizales (WordPress → /feed/ nativo) ─────────
  // El feed general captura noticias de Cultura y Civismo entre otras secciones.
  {
    url: 'https://centrodeinformacion.manizales.gov.co/feed/',
    tipo: 'Convocatoria',
    ambito: 'Local',
  },
  // ── Radio Nacional — sección cultura/convocatorias ─────────────────────────
  {
    url: 'https://www.radionacional.co/rss/noticias-de-cultura',
    tipo: 'Convocatoria',
    ambito: 'Nacional',
  },
];

// ── Palabras clave para filtrar resultados relevantes ─────────────────────────
// Solo conservamos ítems cuyo título o extracto contenga al menos una de estas.
const KEYWORDS_RELEVANTES = [
  'convocatoria', 'convocatorias', 'beca', 'becas', 'estímulo', 'estímulos',
  'estimulo', 'estimulos', 'licitación', 'licitacion', 'contratación',
  'contratacion', 'residencia', 'premio', 'premios', 'formación', 'formacion',
  'capacitación', 'capacitacion', 'postula', 'postúlate', 'postulate',
  'aplica', 'inscripción', 'inscripcion', 'concertación', 'concertacion',
  'portafolio', 'fondo', 'apoyo económico', 'apoyo economico',
  'abierta', 'cierre', 'plazo',
];

function esRelevante(titulo: string, extracto: string): boolean {
  const texto = `${titulo} ${extracto}`.toLowerCase();
  return KEYWORDS_RELEVANTES.some(kw => texto.includes(kw));
}

// ── Detector de tipo a partir del texto ───────────────────────────────────────
function detectarTipo(
  titulo: string,
  extracto: string,
  tipoPorDefecto: TipoConvocatoria
): TipoConvocatoria {
  const texto = `${titulo} ${extracto}`.toLowerCase();
  if (texto.includes('beca') || texto.includes('becas'))             return 'Beca';
  if (texto.includes('estímulo') || texto.includes('estimulo'))      return 'Estímulo';
  if (texto.includes('licitación') || texto.includes('licitacion') ||
      texto.includes('contratación') || texto.includes('contratacion')) return 'Licitación';
  if (texto.includes('residencia'))                                  return 'Residencia';
  if (texto.includes('premio') || texto.includes('premios'))         return 'Premio';
  if (texto.includes('formación') || texto.includes('formacion') ||
      texto.includes('capacitación') || texto.includes('capacitacion') ||
      texto.includes('diplomado') || texto.includes('taller'))       return 'Formación';
  if (texto.includes('concertación') || texto.includes('concertacion')) return 'Concertación';
  return tipoPorDefecto;
}

// ── Utilidades de parseo ───────────────────────────────────────────────────────
function limpiarHTML(texto: string): string {
  return texto
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ').trim();
}

function extraerCampo(itemXml: string, tag: string): string {
  const regex = new RegExp(
    `<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`,
    'i'
  );
  const match = itemXml.match(regex);
  return match ? limpiarHTML(match[1]) : '';
}

function extraerFuente(itemXml: string): string {
  const match = itemXml.match(/<source[^>]*>([^<]+)<\/source>/i);
  if (match) return match[1].trim();
  // Para feeds directos, intentar extraer del link
  const link = extraerCampo(itemXml, 'link');
  if (link.includes('manizales.gov.co'))  return 'Alcaldía de Manizales';
  if (link.includes('caldas.gov.co'))     return 'Gobernación de Caldas';
  if (link.includes('mincultura.gov.co')) return 'MinCulturas';
  if (link.includes('radionacional.co'))  return 'Radio Nacional';
  return 'Portal Cultural';
}

const MESES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
function formatearFecha(fechaStr: string): string {
  try {
    const d = new Date(fechaStr);
    if (isNaN(d.getTime())) return fechaStr;
    return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
  } catch { return fechaStr; }
}

// ── Parsear un feed ────────────────────────────────────────────────────────────
async function parsearFeed(
  feedUrl: string,
  tipoPorDefecto: TipoConvocatoria,
  ambitoPorDefecto: ConvocatoriaItem['ambito']
): Promise<ConvocatoriaItem[]> {
  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 7200 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CulturaCaldas/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const itemsRaw = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];

    const items: ConvocatoriaItem[] = [];

    for (const [idx, item] of itemsRaw.slice(0, 10).entries()) {
      const titulo   = extraerCampo(item, 'title');
      const extracto = extraerCampo(item, 'description');
      const url      = extraerCampo(item, 'link');
      const fecha    = extraerCampo(item, 'pubDate');
      const entidad  = extraerFuente(item);

      if (titulo.length < 5 || url.length < 10) continue;

      const extractoLimpio = extracto
        .replace(/^[^·]+·\s*/, '')
        .slice(0, 240);

      // Filtrar solo convocatorias relevantes
      if (!esRelevante(titulo, extractoLimpio)) continue;

      const tipo = detectarTipo(titulo, extractoLimpio, tipoPorDefecto);

      items.push({
        id: `${tipoPorDefecto}-${idx}-${titulo.slice(0, 20)}`,
        titulo,
        extracto: extractoLimpio || titulo,
        entidad,
        url,
        fecha: (() => { try { return new Date(fecha).toISOString(); } catch { return new Date().toISOString(); } })(),
        fechaLegible: formatearFecha(fecha),
        tipo,
        ambito: ambitoPorDefecto,
      });
    }

    return items;
  } catch { return []; }
}

// ── Handler ────────────────────────────────────────────────────────────────────
export async function GET() {
  const resultados = await Promise.allSettled(
    FEEDS.map(f => parsearFeed(f.url, f.tipo, f.ambito))
  );

  const todas: ConvocatoriaItem[] = resultados
    .filter((r): r is PromiseFulfilledResult<ConvocatoriaItem[]> => r.status === 'fulfilled')
    .flatMap(r => r.value);

  // Deduplicar por título
  const vistos = new Set<string>();
  const unicas = todas.filter(n => {
    const key = n.titulo.slice(0, 60).toLowerCase().trim();
    if (vistos.has(key)) return false;
    vistos.add(key);
    return true;
  });

  // Más recientes primero
  unicas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return NextResponse.json(
    {
      convocatorias: unicas.slice(0, 30),
      actualizadoEn: new Date().toISOString(),
      total: unicas.length,
    },
    {
      headers: { 'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=86400' },
    }
  );
}
