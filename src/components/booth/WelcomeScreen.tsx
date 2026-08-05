import { useEffect, useRef, useState } from "react";
import { GridWave } from "@/components/booth/GridWave";
import { PRESETS, type PresetId } from "@/lib/booth/filters";
import { bow, filmStrip, lips, pearlHeart, star } from "@/lib/booth/stickers";


type Props = {
  preset: PresetId;
  onPreset: (p: PresetId) => void;
  onStart: () => void;
  error: string | null;
  ready: boolean;
};

const svgUrl = (svg: string) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

function Sticker({
  svg,
  className,
  delay = 0,
}: {
  svg: string;
  className: string;
  delay?: number;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute animate-float bg-contain bg-center bg-no-repeat drop-shadow-[0_0_18px_rgba(201,169,110,0.45)] ${className}`}
      style={{ backgroundImage: svgUrl(svg), animationDelay: `${delay}ms` }}
    />
  );
}

const WORDS = ["ready", "set", "shoot"];

export function WelcomeScreen({ preset, onPreset, onStart, error, ready }: Props) {
  const [wave, setWave] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setWave({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    return () => {
      if (idle.current) clearTimeout(idle.current);
    };
  }, []);

  const track = (clientX: number, clientY: number) => {
    setWave({ x: clientX, y: clientY });
    setActive(true);
    if (idle.current) clearTimeout(idle.current);
    idle.current = setTimeout(() => setActive(false), 700);
  };

  return (
    <div
      className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-8 px-5 py-14 sm:gap-10 sm:px-8"
      onPointerMove={(e) => track(e.clientX, e.clientY)}
      onPointerDown={(e) => track(e.clientX, e.clientY)}
      onTouchMove={(e) => {
        const t = e.touches[0];
        if (t) track(t.clientX, t.clientY);
      }}
      onPointerLeave={() => setActive(false)}
    >
      <GridWave x={wave.x} y={wave.y} active={active} />

      {/* funky sticker scatter */}

      <Sticker svg={star("#E7C46B")} className="left-2 top-10 h-12 w-12 sm:h-16 sm:w-16" />
      <Sticker svg={star("#D9D9E0")} className="right-6 top-24 h-8 w-8" delay={600} />
      <Sticker svg={pearlHeart} className="right-2 top-6 h-14 w-14" delay={300} />
      <Sticker svg={bow} className="-left-1 bottom-28 h-16 w-24" delay={900} />
      <Sticker svg={lips} className="right-4 bottom-40 h-12 w-16" delay={1200} />
      <Sticker
        svg={filmStrip}
        className="left-0 top-1/3 hidden h-64 w-8 opacity-70 sm:block"
        delay={200}
      />
      <Sticker svg={star("#E7C46B")} className="bottom-10 left-1/4 h-7 w-7" delay={1500} />

      <header className="text-center">
        <h1 className="font-display text-4xl tracking-tight text-leopard-cream sm:text-6xl">
          THE<span className="text-leopard-tan">y2K</span>booth
          <span className="text-muted-sage">.</span>
        </h1>

        <p className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-display text-3xl italic text-leopard-tan sm:text-5xl">
          {WORDS.map((w, i) => (
            <span
              key={w}
              className="animate-word inline-block drop-shadow-[0_0_22px_rgba(201,169,110,0.55)]"
              style={{ animationDelay: `${i * 420}ms` }}
            >
              {w}
            </span>
          ))}
        </p>

        <p className="mt-4 text-[11px] tracking-[0.3em] text-film-sepia/70 uppercase sm:text-sm">
          four shots · one strip · zero chill
        </p>
      </header>

      <section className="w-full">
        <p className="mb-3 text-xs tracking-[0.35em] text-leopard-tan uppercase">presets</p>
        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={preset === p.id}
              onClick={() => onPreset(p.id)}
              className={`min-h-[11rem] w-[72vw] max-w-xs shrink-0 snap-center touch-manipulation select-none rounded-2xl border p-5 text-left transition-all active:scale-[0.97] sm:w-auto sm:max-w-none ${
                preset === p.id
                  ? "border-leopard-tan bg-surface shadow-[0_0_0_1px_var(--leopard-tan),0_0_28px_-6px_var(--leopard-tan),0_18px_40px_-24px_#000]"
                  : "border-border bg-surface/50 hover:border-leopard-tan/60 hover:shadow-[0_0_22px_-8px_var(--leopard-tan)]"
              }`}
            >
              <div
                className="mb-3 h-20 rounded-xl border border-ink/60"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, #F0E6D3 0%, #C9A96E 45%, #3D2B1A 100%)",
                  filter: p.css,
                }}
              />
              <span className="font-display text-2xl text-leopard-cream">{p.name}</span>
              <p className="mt-1 text-[11px] leading-relaxed text-film-sepia/70">{p.vibe}</p>
            </button>
          ))}
        </div>

      </section>

      {error && (
        <p className="text-sm text-destructive">
          camera shy? check your permissions and try again ✦
        </p>
      )}

      <button
        type="button"
        onClick={onStart}
        className="animate-backlit touch-manipulation rounded-full bg-leopard-tan px-10 py-4 font-display text-xl text-ink transition-transform active:scale-95 sm:px-12 sm:text-2xl"
      >
        {ready ? "snap ✦" : "allow camera ✦"}
      </button>
    </div>
  );
}
