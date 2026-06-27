import ImageResponse from "@takumi-rs/image-response";
import { readFile } from "node:fs/promises";
import path from "node:path";

const width = 1200;
const height = 630;

const colors = {
  bg: "#161821",
  surface: "#1e2132",
  border: "#3e445e",
  muted: "#6b7089",
  text: "#c6c8d1",
  accent: "#84a0c6",
};

const fontDir = path.join(process.cwd(), "src/integrations/og-image/fonts");

const fonts = Promise.all([
  readFile(path.join(fontDir, "instrument-sans-latin-wght-normal.woff2")).then((data) => ({
    name: "Instrument Sans Variable",
    data,
    weight: 400,
    style: "normal" as const,
  })),
  readFile(path.join(fontDir, "instrument-sans-latin-700-normal.woff2")).then((data) => ({
    name: "Instrument Sans Title",
    data,
    weight: 700,
    style: "normal" as const,
  })),
  readFile(path.join(fontDir, "google-sans-code-latin-wght-normal.woff2")).then((data) => ({
    name: "Google Sans Code Variable",
    data,
    weight: 400,
    style: "normal" as const,
  })),
  readFile(path.join(fontDir, "google-sans-code-latin-wght-normal.woff2")).then((data) => ({
    name: "Google Sans Code Variable",
    data,
    weight: 700,
    style: "normal" as const,
  })),
]);

export async function generateOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: colors.bg,
          color: colors.text,
          display: "flex",
          fontFamily: '"Instrument Sans Variable", system-ui, sans-serif',
          position: "relative",
        }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${colors.border} 1px, transparent 1px), linear-gradient(90deg, ${colors.border} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            opacity: 0.14,
          }}
        />

        <div
          style={{
            border: `2px solid ${colors.border}`,
            borderRadius: "18px",
            display: "flex",
            height: "490px",
            margin: "70px 72px",
            padding: "24px",
            width: "1056px",
          }}>
          <div
            style={{
              backgroundColor: "rgba(30, 33, 50, 0.55)",
              borderRadius: "12px",
              display: "flex",
              flex: 1,
              flexDirection: "column",
              padding: "42px 36px",
            }}>
            <div
              style={{
                color: colors.accent,
                display: "flex",
                fontFamily: '"Google Sans Code Variable", ui-monospace, monospace',
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: 0,
                marginBottom: "22px",
              }}>
              DIGITAL GARDEN
            </div>

            <div
              style={{
                color: colors.text,
                display: "flex",
                fontFamily: '"Instrument Sans Title", "Instrument Sans Variable", system-ui, sans-serif',
                fontSize: "108px",
                fontWeight: 700,
                letterSpacing: 0,
                lineHeight: 0.92,
                marginBottom: "30px",
              }}>
              Owais&apos; Places
            </div>

            <div
              style={{
                color: colors.muted,
                display: "flex",
                flexDirection: "column",
                fontSize: "32px",
                gap: "6px",
                lineHeight: 1.15,
                marginBottom: "36px",
              }}>
              <div>Notes on software, writing, philosophy, psychology,</div>
              <div>and the odd trail that connects them.</div>
            </div>

            <div style={{ backgroundColor: colors.border, display: "flex", height: "2px", marginBottom: "46px" }} />

            <div
              style={{
                color: colors.muted,
                display: "flex",
                fontFamily: '"Google Sans Code Variable", ui-monospace, monospace',
                fontSize: "20px",
                letterSpacing: 0,
              }}>
              garden.desertthunder.dev
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
      format: "png",
      fonts: await fonts,
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
