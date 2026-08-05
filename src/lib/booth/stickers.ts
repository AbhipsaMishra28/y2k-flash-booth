/** Seeded RNG so sticker scatter is stable per strip render. */
export function makeRng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const C = {
  cream: "#F0E6D3",
  tan: "#C9A96E",
  spot: "#6B4226",
  ink: "#1A1208",
  sepia: "#D4B896",
  sage: "#8A9E7E",
};

export function star(fill: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 2 L59 38 L96 50 L59 62 L50 98 L41 62 L4 50 L41 38 Z" fill="${fill}" opacity="0.95"/></svg>`;
}

export const lips = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><path d="M60 22c10-16 34-20 46-8 10 10 4 28-10 40-12 10-26 18-36 22-10-4-24-12-36-22C10 42 4 24 14 14c12-12 36-8 46 8z" fill="${C.spot}" opacity="0.85"/><path d="M14 26c14-6 32-2 46 6 14-8 32-12 46-6" stroke="${C.cream}" stroke-width="2.5" fill="none" opacity="0.5"/></svg>`;

export const pearlHeart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 92"><path d="M50 88C22 68 4 50 4 30 4 16 15 6 28 6c9 0 17 5 22 13 5-8 13-13 22-13 13 0 24 10 24 24 0 20-18 38-46 58z" fill="${C.cream}" opacity="0.9"/><circle cx="34" cy="30" r="9" fill="#fff" opacity="0.7"/></svg>`;

export const bow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 90"><path d="M70 45C56 22 26 14 14 26 2 38 10 62 30 68c14 4 28-6 40-23z" fill="${C.tan}"/><path d="M70 45c14-23 44-31 56-19 12 12 4 36-16 42-14 4-28-6-40-23z" fill="${C.tan}"/><ellipse cx="70" cy="45" rx="11" ry="13" fill="${C.spot}"/><path d="M64 56 54 86M76 56 86 86" stroke="${C.tan}" stroke-width="9" stroke-linecap="round"/></svg>`;

export const filmStrip = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 300"><rect width="40" height="300" fill="${C.ink}" opacity="0.85"/>${Array.from(
  { length: 10 },
  (_, i) => `<rect x="11" y="${8 + i * 29}" width="18" height="16" rx="3" fill="${C.sepia}" opacity="0.8"/>`,
).join("")}</svg>`;

export function loadSvg(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  });
}

export function leopardPattern(): string {
  const spots: string[] = [];
  const rng = makeRng(7);
  for (let i = 0; i < 26; i++) {
    const x = rng() * 200;
    const y = rng() * 200;
    const r = 8 + rng() * 9;
    const rot = rng() * 360;
    spots.push(
      `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)})">
        <ellipse rx="${(r * 1.5).toFixed(1)}" ry="${r.toFixed(1)}" fill="none" stroke="${C.spot}" stroke-width="7" stroke-dasharray="14 10"/>
        <ellipse rx="${(r * 0.7).toFixed(1)}" ry="${(r * 0.45).toFixed(1)}" fill="${C.ink}" opacity="0.8"/>
      </g>`,
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="${C.tan}"/>${spots.join("")}</svg>`;
}

export const leopardDataUrl = () =>
  `data:image/svg+xml;utf8,${encodeURIComponent(leopardPattern())}`;
