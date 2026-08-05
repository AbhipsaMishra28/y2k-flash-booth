import {
  bow,
  filmStrip,
  leopardDataUrl,
  lips,
  loadSvg,
  makeRng,
  pearlHeart,
  star,
} from "./stickers";

export const STRIP = {
  border: 28,
  inner: 6,
  frameW: 600,
  frameH: 480,
  gap: 16,
  footer: 160,
};

export const STRIP_W = STRIP.frameW + STRIP.border * 2;
export const STRIP_H =
  STRIP.border * 2 + STRIP.frameH * 4 + STRIP.gap * 3 + STRIP.footer;

const CREAM = "#F0E6D3";
const TAN = "#C9A96E";
const INK = "#1A1208";

export type StripOptions = {
  frames: HTMLCanvasElement[];
  message: string;
  handle: string;
  seed: number;
};

export function todayStamp(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())} · ${p(d.getMonth() + 1)} · ${d.getFullYear()}`;
}

export async function composeStrip(
  canvas: HTMLCanvasElement,
  { frames, message, handle, seed }: StripOptions,
) {
  canvas.width = STRIP_W;
  canvas.height = STRIP_H;
  const ctx = canvas.getContext("2d")!;
  const { border, inner, frameW, frameH, gap } = STRIP;

  // black vintage border ground
  ctx.fillStyle = "#0B0805";
  ctx.fillRect(0, 0, STRIP_W, STRIP_H);

  // leopard texture at 30% opacity behind the strip
  const leo = await loadSvg(decodeURIComponent(leopardDataUrl().split("utf8,")[1]!));
  const pat = ctx.createPattern(leo, "repeat");
  if (pat) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = pat;
    ctx.fillRect(0, 0, STRIP_W, STRIP_H);
    ctx.restore();
  }

  // cream matte inside the border
  ctx.fillStyle = CREAM;
  ctx.fillRect(border - 10, border - 10, frameW + 20, STRIP_H - border * 2 + 20);
  ctx.fillStyle = INK;
  ctx.fillRect(border - inner, border - inner, frameW + inner * 2, STRIP_H - border * 2 + inner * 2);

  // frames
  frames.slice(0, 4).forEach((f, i) => {
    const y = border + i * (frameH + gap);
    ctx.drawImage(f, border, y, frameW, frameH);
    ctx.strokeStyle = "rgba(240,230,211,0.25)";
    ctx.lineWidth = 1;
    ctx.strokeRect(border + 0.5, y + 0.5, frameW - 1, frameH - 1);
  });

  const footerTop = border + 4 * frameH + 3 * gap;

  // footer text
  ctx.textAlign = "center";
  const cx = STRIP_W / 2;
  const empty = !message.trim();
  ctx.fillStyle = empty ? "rgba(240,230,211,0.35)" : CREAM;
  ctx.font = '44px "Great Vibes", cursive';
  ctx.fillText((message.trim() || "photobooth").slice(0, 32), cx, footerTop + 62);

  if (handle.trim()) {
    ctx.fillStyle = TAN;
    ctx.font = '28px "Courier Prime", monospace';
    ctx.fillText(handle.trim().slice(0, 20), cx, footerTop + 100);
  }

  ctx.fillStyle = "rgba(240,230,211,0.6)";
  ctx.font = '22px "Courier Prime", monospace';
  ctx.fillText(todayStamp(), cx, footerTop + (handle.trim() ? 134 : 118));

  await drawStickers(ctx, seed);
}

async function drawStickers(ctx: CanvasRenderingContext2D, seed: number) {
  const rng = makeRng(seed);
  const [film, heart, bowImg, lipImg] = await Promise.all([
    loadSvg(filmStrip),
    loadSvg(pearlHeart),
    loadSvg(bow),
    loadSvg(lips),
  ]);
  const golds = await Promise.all([
    loadSvg(star("#E7C46B")),
    loadSvg(star("#D9D9E0")),
  ]);

  const place = (
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
    rot: number,
    alpha = 1,
  ) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  };

  // film strip motif down the left margin edge
  place(film, 16, STRIP_H * 0.35, 26, 300, 0, 0.75);

  // pearl hearts in the top corners
  place(heart, 44, 44, 52, 48, -12, 0.95);
  place(heart, STRIP_W - 44, 52, 44, 40, 14, 0.9);

  // ribbon bow, right edge mid-strip
  place(bowImg, STRIP_W - 26, STRIP_H * 0.5, 92, 60, -8, 0.95);

  // kiss lips, lower third
  place(lipImg, 70, STRIP_H * 0.74, 86, 58, -18, 0.85);
  place(lipImg, STRIP_W - 62, STRIP_H * 0.83, 70, 48, 12, 0.8);

  // star scatter across the margins
  const count = 10;
  for (let i = 0; i < count; i++) {
    const left = i % 2 === 0;
    const x = left ? 14 + rng() * 16 : STRIP_W - 14 - rng() * 16;
    const y = 90 + rng() * (STRIP_H - 220);
    const s = 14 + rng() * 18;
    place(golds[i % 2]!, x, y, s, s, rng() * 90, 0.75 + rng() * 0.25);
  }
}
