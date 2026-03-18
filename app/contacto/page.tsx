'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import PageLayout from '@/components/PageLayout';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const contactInfo = [
  {
    icon: <MapPin className="w-6 h-6 text-[#e63947]" />,
    title: 'Dirección',
    details: ['Calle 20 #22-45', 'Manizales, Caldas'],
  },
  {
    icon: <Phone className="w-6 h-6 text-[#e63947]" />,
    title: 'Teléfono',
    details: ['+57 (6) 887 9300', '+57 (6) 887 9301'],
  },
  {
    icon: <Mail className="w-6 h-6 text-[#e63947]" />,
    title: 'Email',
    details: ['cultura@caldas.gov.co', 'info@culturacaldas.gov.co'],
  },
  {
    icon: <Clock className="w-6 h-6 text-[#e63947]" />,
    title: 'Horario de Atención',
    details: ['Lun-Vie: 8:00 - 17:00', 'Sáb: 9:00 - 13:00'],
  },
];

export default function ContactoPage() {
  return (
    <PageLayout letter="C" letterPosition="top-left">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block px-6 py-2 bg-[#e63947]/10 rounded-full mb-6">
            <span className="text-[#e63947] text-sm tracking-widest">CONTACTO</span>
          </div>
          <h1 className="text-5xl mb-4 text-[#2a9d8f]">Contáctanos</h1>
          <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
            ¿Tienes preguntas o quieres participar? Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Info de contacto */}
          <div>
            <h2 className="text-2xl mb-6 text-[#2a9d8f]">Información de Contacto</h2>
            <div className="space-y-4">
              {contactInfo.map((item, i) => (
                <Card key={i} className="border-[#e63947]/20 hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5">{item.icon}</div>
                      <div>
                        <h3 className="text-base font-medium mb-1 text-[#2a9d8f]">{item.title}</h3>
                        {item.details.map((d, j) => (
                          <p key={j} className="text-[#6B7280] text-sm">{d}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Formulario */}
          <div>
            <h2 className="text-2xl mb-6 text-[#2a9d8f]">Envíanos un Mensaje</h2>
            <Card className="border-[#e63947]/20">
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input id="name" placeholder="Tu nombre" />
                  </div>
                  <div>
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" type="tel" placeholder="300 123 4567" />
                  </div>
                  <div>
                    <Label htmlFor="subject">Asunto</Label>
                    <Input id="subject" placeholder="¿En qué podemos ayudarte?" />
                  </div>
                  <div>
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea id="message" rows={5} placeholder="Escribe tu mensaje aquí..." />
                  </div>
                  <Button type="submit" size="lg" className="w-full py-6">
                    Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
