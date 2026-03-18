// supabase/functions/send-email/index.ts
// ══════════════════════════════════════════════════════════════════════
// Edge Function: Cultura Caldas — Emails
// Tipos: nueva_solicitud_org | nuevo_evento | magic_link
// Usa nodemailer + Gmail SMTP
// ══════════════════════════════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.7";

// ── Tipos ─────────────────────────────────────────────────────────────
interface EmailRequest {
  type: "nueva_solicitud_org" | "nuevo_evento" | "magic_link" | "codigo_verificacion";
  to: string;
  data: Record<string, any>;
}

// ── CORS ──────────────────────────────────────────────────────────────
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ══════════════════════════════════════════════════════════════════════
// TEMPLATE BASE — colores Cultura Caldas
// ══════════════════════════════════════════════════════════════════════
const getBaseTemplate = (title: string, content: string): string => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; }
    .header { background: linear-gradient(135deg, #e63947 0%, #2a9d8f 100%); padding: 28px 20px; text-align: center; }
    .header-title { color: white; font-size: 22px; font-weight: 700; letter-spacing: 1px; }
    .header-sub { color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 6px; letter-spacing: 3px; }
    .content { padding: 36px 30px; }
    .title { font-size: 20px; color: #2a9d8f; margin-bottom: 14px; font-weight: 700; }
    .message { font-size: 15px; color: #444; line-height: 1.65; margin-bottom: 24px; }
    .info-box { background-color: #fff7f0; border-left: 4px solid #e63947; padding: 18px 20px; margin: 20px 0; border-radius: 4px; }
    .info-row { display: flex; margin-bottom: 10px; font-size: 14px; }
    .info-row:last-child { margin-bottom: 0; }
    .info-label { font-weight: 700; color: #2a9d8f; min-width: 180px; }
    .info-value { color: #333; }
    .btn { display: inline-block; background: linear-gradient(135deg, #e63947 0%, #d4621a 100%); color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 15px; margin-top: 10px; }
    .btn-navy { display: inline-block; background: linear-gradient(135deg, #2a9d8f 0%, #2d3f7a 100%); color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 15px; margin-top: 10px; }
    .alert-info { background-color: #eff6ff; border-left: 4px solid #0f4c75; padding: 14px 18px; margin: 16px 0; border-radius: 4px; color: #1e40af; font-size: 14px; line-height: 1.6; }
    .divider { height: 1px; background: linear-gradient(to right, transparent, #e63947, transparent); margin: 28px 0; }
    .footer { background-color: #2a9d8f; color: white; padding: 28px 20px; text-align: center; }
    .footer-title { font-size: 16px; margin-bottom: 6px; color: #e63947; font-weight: 700; }
    .footer-text { font-size: 13px; color: rgba(255,255,255,0.7); margin: 4px 0; }
    .footer-note { margin-top: 14px; font-size: 11px; color: rgba(255,255,255,0.4); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-title">CULTURA CALDAS</div>
      <div class="header-sub">PLATAFORMA CULTURAL DEL DEPARTAMENTO</div>
    </div>
    ${content}
    <div class="footer">
      <div class="footer-title">Cultura Caldas</div>
      <div class="footer-text">Fundación de Caldas</div>
      <div class="footer-text">Manizales, Caldas — Colombia</div>
      <div class="footer-note">Este es un correo automático, por favor no responder.</div>
    </div>
  </div>
</body>
</html>`;

// ══════════════════════════════════════════════════════════════════════
// TEMPLATE 1 — Nueva solicitud de organización (al admin)
// ══════════════════════════════════════════════════════════════════════
const getNuevaSolicitudOrgTemplate = (data: Record<string, any>): string =>
  getBaseTemplate("Nueva Organización Pendiente", `
    <div class="content">
      <div class="title">🏛️ Nueva Organización Pendiente de Aprobación</div>
      <div class="message">
        Una nueva organización cultural ha solicitado ser inscrita en el directorio
        de la Plataforma Cultural de Caldas. Revisa la información y aprueba o rechaza
        la solicitud desde el panel de administración.
      </div>
      <div class="info-box">
        <div class="info-row">
          <div class="info-label">Organización:</div>
          <div class="info-value"><strong>${data.razon_social}</strong></div>
        </div>
        <div class="info-row">
          <div class="info-label">Municipio:</div>
          <div class="info-value">${data.municipio}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Sector Cultural:</div>
          <div class="info-value">${data.sector_cultural || "No especificado"}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Contacto:</div>
          <div class="info-value">${data.nombre_contacto || "No especificado"}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Correo:</div>
          <div class="info-value">${data.correo}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Teléfono:</div>
          <div class="info-value">${data.telefono_1 || "No especificado"}</div>
        </div>
      </div>
      <div class="alert-info">
        📋 La solicitud quedó registrada con estado <strong>Pendiente</strong>.
        Ingresa al panel de administración para revisarla completa y tomar una decisión.
      </div>
      <div style="text-align:center; margin-top:28px;">
        <a href="${Deno.env.get("APP_URL")}/admin" class="btn">
          Ir al Panel de Administración
        </a>
      </div>
    </div>`);

// ══════════════════════════════════════════════════════════════════════
// TEMPLATE 2 — Nuevo evento pendiente (al admin)
// ══════════════════════════════════════════════════════════════════════
const getNuevoEventoTemplate = (data: Record<string, any>): string =>
  getBaseTemplate("Nuevo Evento Pendiente", `
    <div class="content">
      <div class="title">🎭 Nuevo Evento Pendiente de Aprobación</div>
      <div class="message">
        Una organización ha registrado un nuevo evento cultural que requiere
        tu aprobación para aparecer en la Agenda Cultural de Caldas.
      </div>
      <div class="info-box">
        <div class="info-row">
          <div class="info-label">Evento:</div>
          <div class="info-value"><strong>${data.titulo}</strong></div>
        </div>
        <div class="info-row">
          <div class="info-label">Organización:</div>
          <div class="info-value">${data.nombre_organizacion}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Municipio:</div>
          <div class="info-value">${data.municipio || "No especificado"}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Fecha:</div>
          <div class="info-value">
            ${data.fecha_inicio}${data.fecha_fin ? ` al ${data.fecha_fin}` : ""}
          </div>
        </div>
        <div class="info-row">
          <div class="info-label">Tipo:</div>
          <div class="info-value">${data.tipo_evento || "No especificado"}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Contacto:</div>
          <div class="info-value">${data.correo_contacto}</div>
        </div>
      </div>
      <div class="alert-info">
        📋 El evento quedó registrado con estado <strong>Pendiente</strong>.
        Ingresa al panel de administración para revisarlo completo y tomar una decisión.
      </div>
      <div style="text-align:center; margin-top:28px;">
        <a href="${Deno.env.get("APP_URL")}/admin" class="btn">
          Ir al Panel de Administración
        </a>
      </div>
    </div>`);

// ══════════════════════════════════════════════════════════════════════
// TEMPLATE 4 — Código de verificación (a la organización)
// ══════════════════════════════════════════════════════════════════════
const getCodigoVerificacionTemplate = (data: Record<string, any>): string =>
  getBaseTemplate("Código de verificación", `
    <div class="content">
      <div class="title">🔐 Tu código de verificación</div>
      <div class="message">
        Hola, <strong>${data.razon_social}</strong>. Recibimos tu solicitud para
        actualizar la información de tu organización en la Plataforma Cultural de Caldas.
        Usa el siguiente código para continuar:
      </div>

      <!-- Código grande y centrado -->
      <div style="text-align:center; margin: 32px 0;">
        <div style="
          display: inline-block;
          background: linear-gradient(135deg, #2a9d8f 0%, #2d3f7a 100%);
          color: white;
          font-size: 42px;
          font-weight: 900;
          letter-spacing: 12px;
          padding: 24px 40px;
          border-radius: 12px;
          font-family: 'Courier New', monospace;
        ">${data.codigo}</div>
      </div>

      <div class="alert-info">
        ⏱️ Este código es de un solo uso y <strong>expira en ${data.expires_minutes || 15} minutos</strong>.
        Si no solicitaste este código, puedes ignorar este correo — tu organización
        no será modificada.
      </div>

      <div class="divider"></div>

      <div style="font-size:13px; color:#999; text-align:center; line-height:1.6;">
        Si tienes problemas para actualizar tu información, escríbenos a<br>
        <span style="color:#2a9d8f;">${Deno.env.get("GMAIL_USER")}</span>
      </div>
    </div>`);

// ══════════════════════════════════════════════════════════════════════
// TEMPLATE 3 — Magic link (a la organización)
// ══════════════════════════════════════════════════════════════════════
const getMagicLinkTemplate = (data: Record<string, any>): string => {
  const esEvento = data.accion === "evento";
  const accionTexto = esEvento ? "registrar un evento" : "actualizar tu información";
  const accionTitulo = esEvento ? "Registrar un Evento" : "Actualizar tu Información";

  return getBaseTemplate(`Enlace para ${accionTitulo}`, `
    <div class="content">
      <div class="title">🔗 Tu enlace para ${accionTitulo}</div>
      <div class="message">
        Recibimos tu solicitud para <strong>${accionTexto}</strong> en la
        Plataforma Cultural de Caldas. Usa el botón de abajo para continuar.
      </div>
      <div class="alert-info">
        ⏱️ Este enlace es de un solo uso y <strong>expira en 1 hora</strong>.
        Si no lo solicitaste, puedes ignorar este correo.
      </div>
      <div style="text-align:center; margin-top:32px;">
        <a href="${data.magic_link}" class="btn-navy">
          ${esEvento ? "Registrar mi Evento →" : "Actualizar mi Información →"}
        </a>
      </div>
      <div class="divider"></div>
      <div style="font-size:12px; color:#999; text-align:center;">
        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
        <span style="color:#2a9d8f; word-break:break-all;">${data.magic_link}</span>
      </div>
    </div>`);
};

// ══════════════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL
// ══════════════════════════════════════════════════════════════════════
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const body = await req.json();
    const { type, to, data }: EmailRequest = body;

    // Validación básica
    if (!type || !to || !data) {
      return new Response(
        JSON.stringify({ error: "Faltan parámetros: type, to y data son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Credenciales Gmail desde secrets de Supabase
    const GMAIL_USER         = Deno.env.get("GMAIL_USER");
    const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      return new Response(
        JSON.stringify({ error: "Credenciales Gmail no configuradas en secrets" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });

    let subject = "";
    let html    = "";

    switch (type) {
      case "nueva_solicitud_org":
        subject = `🏛️ Nueva organización pendiente: ${data.razon_social}`;
        html    = getNuevaSolicitudOrgTemplate(data);
        break;

      case "nuevo_evento":
        subject = `🎭 Nuevo evento pendiente: ${data.titulo}`;
        html    = getNuevoEventoTemplate(data);
        break;

      case "codigo_verificacion":
        subject = `🔐 Tu código de verificación — Cultura Caldas`;
        html    = getCodigoVerificacionTemplate(data);
        break;

      case "magic_link":
        subject = data.accion === "evento"
          ? "🎭 Tu enlace para registrar un evento — Cultura Caldas"
          : "🔗 Tu enlace para actualizar tu información — Cultura Caldas";
        html = getMagicLinkTemplate(data);
        break;

      default:
        return new Response(
          JSON.stringify({ error: `Tipo de email no reconocido: ${type}` }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    console.log(`📧 Enviando [${type}] a: ${to}`);

    const info = await transporter.sendMail({
      from: `Cultura Caldas <${GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email enviado:", info.messageId);

    return new Response(
      JSON.stringify({ success: true, messageId: info.messageId }),
      { status: 200, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    return new Response(
      JSON.stringify({ error: "Error al enviar email", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }
});
