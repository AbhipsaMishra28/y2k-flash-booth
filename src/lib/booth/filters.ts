export type PresetId = "y2k" | "noir" | "film";

export const PRESETS: {
  id: PresetId;
  name: string;
  vibe: string;
  css: string;
}[] = [
  {
    id: "y2k",
    name: "y2k",
    vibe: "warm pink glow, dreamy",
    css: "sepia(0.25) saturate(1.3) hue-rotate(-15deg) brightness(1.1)",
  },
  {
    id: "noir",
    name: "noir",
    vibe: "heavy sepia, moody, dark",
    css: "sepia(0.85) saturate(0.4) contrast(1.35) brightness(0.92)",
  },
  {
    id: "film",
    name: "film",
    vibe: "muted, cinematic, green shadows",
    css: "sepia(0.35) hue-rotate(15deg) saturate(0.85) contrast(1.1)",
  },
];

export const presetCss = (id: PresetId) =>
  PRESETS.find((p) => p.id === id)?.css ?? PRESETS[0].css;

/** Draws the video frame into a canvas with the full filter pipeline applied. */
export function renderFrame(
  source: CanvasImageSource,
  sw: number,
  sh: number,
  preset: PresetId,
  w = 600,
  h = 480,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // cover-crop the source into the frame box
  const scale = Math.max(w / sw, h / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  const dx = (w - dw) / 2;
  const dy = (h - dh) / 2;

  // base tone, mirrored (selfie natural)
  ctx.save();
  ctx.filter = presetCss(preset);
  ctx.translate(w, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(source, dx, dy, dw, dh);
  ctx.restore();

  // soft dreamy halo — blurred composite of the frame itself
  const blurred = document.createElement("canvas");
  blurred.width = w;
  blurred.height = h;
  const bctx = blurred.getContext("2d")!;
  bctx.filter = `${presetCss(preset)} blur(14px)`;
  bctx.translate(w, 0);
  bctx.scale(-1, 1);
  bctx.drawImage(source, dx, dy, dw, dh);
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.globalCompositeOperation = "lighter";
  ctx.drawImage(blurred, 0, 0);
  ctx.restore();

  // y2k polar bloom — signature layer on every preset
  const bloom = ctx.createRadialGradient(w / 2, h * 0.42, 0, w / 2, h * 0.42, w * 0.6);
  bloom.addColorStop(0, "rgba(255,220,230,0.22)");
  bloom.addColorStop(1, "rgba(255,220,230,0)");
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, w, h);

  // vintage flash burn at the corners
  ctx.save();
  ctx.globalCompositeOperation = "lighten";
  for (const [cx, cy] of [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ]) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.45);
    g.addColorStop(0, "rgba(255,240,245,0.14)");
    g.addColorStop(1, "rgba(255,240,245,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();

  // vignette
  const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.28, w / 2, h / 2, w * 0.78);
  vig.addColorStop(0, "rgba(26,18,8,0)");
  vig.addColorStop(1, preset === "noir" ? "rgba(26,18,8,0.85)" : "rgba(26,18,8,0.7)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);

  // procedural film grain
  const amount = preset === "film" ? 0.09 : 0.06;
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 255 * amount;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);

  return canvas;
}
