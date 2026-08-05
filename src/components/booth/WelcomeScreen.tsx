import { PRESETS, type PresetId } from "@/lib/booth/filters";

type Props = {
  preset: PresetId;
  onPreset: (p: PresetId) => void;
  flash: boolean;
  onFlash: (f: boolean) => void;
  onStart: () => void;
  error: string | null;
  ready: boolean;
};

export function WelcomeScreen({
  preset,
  onPreset,
  flash,
  onFlash,
  onStart,
  error,
  ready,
}: Props) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-10 px-8 py-16">
      <header className="text-center">
        <h1 className="font-display text-6xl tracking-tight text-leopard-cream">
          THE<span className="text-leopard-tan">y2K</span>booth<span className="text-muted-sage">.</span>
        </h1>
        <p className="mt-3 text-sm tracking-[0.3em] text-film-sepia/70 uppercase">
          four shots · one strip · zero chill
        </p>
      </header>

      <section className="w-full">
        <p className="mb-3 text-xs tracking-[0.25em] text-leopard-tan uppercase">
          pick your look
        </p>
        <div className="grid grid-cols-3 gap-4">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => onPreset(p.id)}
              className={`rounded-2xl border p-5 text-left transition-all ${
                preset === p.id
                  ? "border-leopard-tan bg-surface shadow-[0_0_0_1px_var(--leopard-tan),0_18px_40px_-24px_#000]"
                  : "border-border bg-surface/50 hover:border-leopard-tan/60"
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

      <section className="w-full rounded-2xl border border-border bg-surface/60 p-6">
        <p className="font-display text-xl text-leopard-cream">turn flash on?</p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => onFlash(true)}
            className={`rounded-full px-5 py-2 text-sm transition-colors ${
              flash
                ? "bg-leopard-tan text-ink"
                : "border border-border text-film-sepia hover:border-leopard-tan/60"
            }`}
          >
            ☀ yes, flash me
          </button>
          <button
            onClick={() => onFlash(false)}
            className={`rounded-full px-5 py-2 text-sm transition-colors ${
              !flash
                ? "bg-leopard-tan text-ink"
                : "border border-border text-film-sepia hover:border-leopard-tan/60"
            }`}
          >
            ✦ no thanks
          </button>
        </div>
        <p className="mt-3 text-[11px] text-film-sepia/60">
          flash is screen-simulated on desktop ✦
        </p>
      </section>

      {error && (
        <p className="text-sm text-destructive">camera shy? check your permissions and try again ✦</p>
      )}

      <button
        onClick={onStart}
        className="rounded-full bg-leopard-tan px-12 py-4 font-display text-2xl text-ink transition-transform hover:scale-105"
      >
        {ready ? "let's go ✦" : "allow camera ✦"}
      </button>
    </div>
  );
}
