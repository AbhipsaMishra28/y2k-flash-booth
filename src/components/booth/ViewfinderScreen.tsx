import { useEffect, useRef, useState } from "react";
import { presetCss, renderFrame, type PresetId } from "@/lib/booth/filters";
import { ding, shutterClick } from "@/lib/booth/sound";

const INTERVAL_MS = 3000;
const HOLD_MS = 2000;
const FLASH_MS = 120;
const SHOTS = 4;

type Props = {
  stream: MediaStream;
  preset: PresetId;
  flash: boolean;
  onDone: (frames: HTMLCanvasElement[]) => void;
};

export function ViewfinderScreen({ stream, preset, flash, onDone }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shot, setShot] = useState(0);
  const [count, setCount] = useState(3);
  const [flashing, setFlashing] = useState(false);
  const [frozen, setFrozen] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && video.srcObject !== stream) {
      video.srcObject = stream;
      void video.play().catch(() => {});
    }
  }, [stream]);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const frames: HTMLCanvasElement[] = [];

    (async () => {
      const video = videoRef.current;
      if (!video) return;
      while (video.videoWidth === 0 && !cancelled) await wait(100);

      for (let i = 0; i < SHOTS; i++) {
        if (cancelled) return;
        setShot(i);
        setFrozen(null);
        for (let n = 3; n >= 1; n--) {
          if (cancelled) return;
          setCount(n);
          await wait(INTERVAL_MS / 3);
        }
        if (cancelled) return;

        if (flash) {
          setFlashing(true);
          setTimeout(() => setFlashing(false), FLASH_MS);
        }
        shutterClick();
        const frame = renderFrame(video, video.videoWidth, video.videoHeight, preset);
        frames.push(frame);
        setFrozen(frame.toDataURL("image/png"));
        await wait(HOLD_MS);
      }
      if (cancelled) return;
      ding();
      onDone(frames);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-8">
      <div className="relative rounded-[20px] border-[14px] border-ink bg-ink shadow-[0_40px_80px_-40px_#000]">
        <div className="relative h-[360px] w-[480px] overflow-hidden bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            className="h-full w-full object-cover"
            style={{ transform: "scaleX(-1)", filter: presetCss(preset) }}
          />
          {frozen && (
            <img
              src={frozen}
              alt={`captured frame ${shot + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow: "inset 0 0 90px 30px rgba(26,18,8,0.65)",
            }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 flex w-5 flex-col justify-around bg-ink/80 px-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="block h-3 rounded-[2px] bg-film-sepia/70" />
            ))}
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 flex w-5 flex-col justify-around bg-ink/80 px-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="block h-3 rounded-[2px] bg-film-sepia/70" />
            ))}
          </div>

          <span className="absolute top-3 left-8 rounded-full bg-ink/70 px-3 py-1 text-[11px] tracking-[0.2em] text-leopard-tan uppercase">
            {preset}
          </span>
          <span className="absolute top-3 right-8 rounded-full bg-ink/70 px-3 py-1 text-[11px] tracking-[0.2em] text-leopard-cream">
            {shot + 1} / {SHOTS}
          </span>

          {!frozen && (
            <span
              key={`${shot}-${count}`}
              className="animate-pop absolute inset-0 flex items-center justify-center font-display text-[120px] text-leopard-cream/90 drop-shadow-[0_6px_24px_rgba(0,0,0,0.6)]"
            >
              {count}
            </span>
          )}

          {flashing && <div className="absolute inset-0 bg-white/85" />}
        </div>
      </div>
      <p className="text-xs tracking-[0.25em] text-film-sepia/70 uppercase">
        {frozen ? "nice one ✦ hold tight" : "look alive ✦"}
      </p>
    </div>
  );
}
