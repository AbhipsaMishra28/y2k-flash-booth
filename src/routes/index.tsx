import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { LeopardBackground } from "@/components/booth/LeopardBackground";
import { StripPreview } from "@/components/booth/StripPreview";
import { ViewfinderScreen } from "@/components/booth/ViewfinderScreen";
import { WelcomeScreen } from "@/components/booth/WelcomeScreen";
import type { PresetId } from "@/lib/booth/filters";
import { unlockAudio } from "@/lib/booth/sound";

const TITLE = "THEy2Kbooth. — vintage leopard photo strips";
const DESC =
  "a desktop photobooth that shoots 4-frame strips with a dreamy y2k glow, film grain and leopard-print trim. save it, share it, upload it.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Booth,
});

type Screen = "welcome" | "viewfinder" | "strip";

function Booth() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [preset, setPreset] = useState<PresetId>("y2k");
  const [flash, setFlash] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [frames, setFrames] = useState<HTMLCanvasElement[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2400);
  }, []);

  const requestCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(s);
      setError(null);
      return s;
    } catch {
      setError("denied");
      return null;
    }
  }, []);

  useEffect(() => {
    void requestCamera();
    return () => {
      setStream((s) => {
        s?.getTracks().forEach((t) => t.stop());
        return null;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async () => {
    unlockAudio();
    const s = stream ?? (await requestCamera());
    if (s) setScreen("viewfinder");
  };

  return (
    <main className="relative min-h-screen min-w-[1024px] overflow-x-auto bg-background">
      <LeopardBackground />

      {screen === "welcome" && (
        <WelcomeScreen
          preset={preset}
          onPreset={setPreset}
          flash={flash}
          onFlash={setFlash}
          onStart={start}
          error={error}
          ready={!!stream}
        />
      )}

      {screen === "viewfinder" && stream && (
        <ViewfinderScreen
          stream={stream}
          preset={preset}
          flash={flash}
          onDone={(f) => {
            setFrames(f);
            setScreen("strip");
            toast("your strip is ready ✦");
          }}
        />
      )}

      {screen === "strip" && (
        <StripPreview
          frames={frames}
          toast={toast}
          onRestart={() => {
            setFrames([]);
            setScreen("viewfinder");
          }}
        />
      )}

      {toastMsg && (
        <div className="animate-pop fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-leopard-tan/50 bg-surface px-6 py-3 text-sm text-leopard-cream shadow-[0_20px_40px_-20px_#000]">
          {toastMsg}
        </div>
      )}
    </main>
  );
}
