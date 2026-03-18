// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://cultura.fundacioncaldas.org',                        priority: 1 },
    { url: 'https://cultura.fundacioncaldas.org/organizaciones',         priority: 0.9 },
    { url: 'https://cultura.fundacioncaldas.org/caldas-cultural/agenda', priority: 0.9 },
    { url: 'https://cultura.fundacioncaldas.org/labter',                 priority: 0.8 },
    { url: 'https://cultura.fundacioncaldas.org/convocatorias',          priority: 0.8 },
    { url: 'https://cultura.fundacioncaldas.org/conexion-cultural',      priority: 0.7 },
  ];
}
