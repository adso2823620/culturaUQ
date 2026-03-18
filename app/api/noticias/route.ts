// app/api/noticias/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 3600;

export type NoticiaItem = {
  id: string;
  titulo: string;
  extracto: string;
  fuente: string;
  url: string;
  fecha: string;
  fechaLegible: string;
  categoria: string;
};

const FEEDS = [
  {
    url: 'https://news.google.com/rss/search?q=cultura+caldas+colombia&hl=es-419&gl=CO&ceid=CO:es',
    categoria: 'Cultura',
  },
  {
    url: 'https://news.google.com/rss/search?q=arte+festival+manizales&hl=es-419&gl=CO&ceid=CO:es',
    categoria: 'Arte',
  },
  {
    url: 'https://news.google.com/rss/search?q=patrimonio+cultural+caldas&hl=es-419&gl=CO&ceid=CO:es',
    categoria: 'Patrimonio',
  },
  {
    url: 'https://news.google.com/rss/search?q=musica+danza+caldas&hl=es-419&gl=CO&ceid=CO:es',
    categoria: 'Música y Danza',
  },
  {
    url: 'https://news.google.com/rss/search?q=convocatoria+cultural+colombia&hl=es-419&gl=CO&ceid=CO:es',
    categoria: 'Convocatorias',
  },
  {
    url: 'https://news.google.com/rss/search?q=teatro+danza+eje+cafetero&hl=es-419&gl=CO&ceid=CO:es',
    categoria: 'Escénicas',
  },
  {
    url: 'https://news.google.com/rss/search?q=artesanias+patrimonio+eje+cafetero&hl=es-419&gl=CO&ceid=CO:es',
    categoria: 'Artesanías',
  },
  {
    url: 'https://news.google.com/rss/search?q=manizales+festival+cultural&hl=es-419&gl=CO&ceid=CO:es',
    categoria: 'Festivales',
  },
  {
    url: 'https://www.radionacional.co/rss/noticias-de-cultura',
    categoria: 'Nacional',
  },
];

function limpiarHTML(texto: string): string {
  return texto
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ').trim();
}

function extraerCampo(itemXml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i');
  const match = itemXml.match(regex);
  return match ? limpiarHTML(match[1]) : '';
}

function extraerFuente(itemXml: string): string {
  const match = itemXml.match(/<source[^>]*>([^<]+)<\/source>/i);
  return match ? match[1].trim() : 'Noticia';
}

const MESES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
function formatearFecha(fechaStr: string): string {
  try {
    const d = new Date(fechaStr);
    if (isNaN(d.getTime())) return fechaStr;
    return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
  } catch { return fechaStr; }
}

async function parsearFeed(feedUrl: string, categoria: string): Promise<NoticiaItem[]> {
  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CulturaCaldas/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const itemsRaw = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];

    return itemsRaw.slice(0, 7).map((item, idx) => {
      const titulo   = extraerCampo(item, 'title');
      const extracto = extraerCampo(item, 'description');
      const url      = extraerCampo(item, 'link');
      const fecha    = extraerCampo(item, 'pubDate');
      const fuente   = extraerFuente(item);
      const extractoLimpio = extracto.replace(/^[^·]+·\s*/, '').slice(0, 200);

      return {
        id: `${categoria}-${idx}-${titulo.slice(0, 20)}`,
        titulo,
        extracto: extractoLimpio || titulo,
        fuente,
        url,
        fecha: (() => { try { return new Date(fecha).toISOString(); } catch { return fecha; } })(),
        fechaLegible: formatearFecha(fecha),
        categoria,
      } satisfies NoticiaItem;
    }).filter(n => n.titulo.length > 5 && n.url.length > 10);
  } catch { return []; }
}

export async function GET() {
  const resultados = await Promise.allSettled(FEEDS.map(f => parsearFeed(f.url, f.categoria)));

  const todas: NoticiaItem[] = resultados
    .filter((r): r is PromiseFulfilledResult<NoticiaItem[]> => r.status === 'fulfilled')
    .flatMap(r => r.value);

  const vistos = new Set<string>();
  const unicas = todas.filter(n => {
    const key = n.titulo.slice(0, 50).toLowerCase().trim();
    if (vistos.has(key)) return false;
    vistos.add(key);
    return true;
  });

  unicas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return NextResponse.json(
    { noticias: unicas.slice(0, 30), actualizadoEn: new Date().toISOString() },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
  );
}
