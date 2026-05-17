import type { APIRoute } from "astro";
import sharp from "sharp";

const width = 1200;
const height = 630;

const colors = {
  bg: "#121212",
  bgRaised: "#181818",
  panel: "#2a2a2a",
  text: "#dbd7ca",
  textMuted: "#bfbaaa",
  comment: "#758575",
  border: "#333333",
  green: "#4d9375",
  mint: "#80a665",
  teal: "#5da994",
  salmon: "#c98a7d",
  red: "#cb7676",
  amber: "#d4976c",
  blue: "#6394bf",
};

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function renderOgSvg() {
  const title = escapeHtml("Owais' Places");
  const subtitle = escapeHtml("A digital garden by desertthunder.dev");
  const path = escapeHtml("garden.desertthunder.dev");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${colors.bg}"/>
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="2" fill="${colors.comment}" opacity="0.28"/>
    </pattern>
    <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="22" stdDeviation="26" flood-color="#000000" flood-opacity="0.42"/>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#dots)"/>
  <circle cx="1040" cy="90" r="170" fill="${colors.green}" opacity="0.11"/>
  <circle cx="160" cy="560" r="220" fill="${colors.red}" opacity="0.10"/>
  <path d="M0 540 C210 470 315 610 535 540 C760 468 895 580 1200 500" stroke="${colors.green}" stroke-width="2" opacity="0.26"/>
  <path d="M0 578 C245 502 345 643 592 575 C822 511 940 612 1200 552" stroke="${colors.amber}" stroke-width="2" opacity="0.22"/>

  <g filter="url(#soft-shadow)">
    <rect x="78" y="72" width="1044" height="486" rx="24" fill="${colors.bgRaised}" stroke="${colors.border}" stroke-width="2"/>
    <rect x="78" y="72" width="1044" height="62" rx="24" fill="${colors.panel}"/>
    <path d="M78 112 Q78 72 118 72 H1082 Q1122 72 1122 112 V134 H78 Z" fill="${colors.panel}"/>
    <line x1="78" y1="134" x2="1122" y2="134" stroke="${colors.border}" stroke-width="2"/>

    <circle cx="116" cy="103" r="8" fill="${colors.red}"/>
    <circle cx="143" cy="103" r="8" fill="${colors.amber}"/>
    <circle cx="170" cy="103" r="8" fill="${colors.green}"/>
    <text x="214" y="110" fill="${colors.comment}" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="20">${path}</text>

    <rect x="126" y="188" width="96" height="8" rx="4" fill="${colors.green}"/>
    <rect x="238" y="188" width="56" height="8" rx="4" fill="${colors.salmon}"/>
    <rect x="310" y="188" width="72" height="8" rx="4" fill="${colors.teal}"/>

    <text x="126" y="302" fill="${colors.text}" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="82" font-weight="760" letter-spacing="0">${title}</text>
    <text x="128" y="358" fill="${colors.textMuted}" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="30" letter-spacing="0">${subtitle}</text>
  </g>
</svg>`;
}

export const GET: APIRoute = async () => {
  const png = await sharp(Buffer.from(renderOgSvg())).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" },
  });
};

export function getStaticPaths() {
  return [{}];
}

export const prerender = true;
