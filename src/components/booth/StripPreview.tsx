import { useEffect, useMemo, useRef, useState } from "react";
import { composeStrip } from "@/lib/booth/strip";

type Props = {
  frames: HTMLCanvasElement[];
  onRestart: () => void;
  toast: (msg: string) => void;
};

export function StripPreview({ frames, onRestart, toast }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const getCanvas = () => (canvasRef.current ??= document.createElement("canvas"));
  const [message, setMessage] = useState("");
  const [handle, setHandle] = useState("");
  const [src, setSrc] = useState<string | null>(null);
  const seed = useMemo(() => Math.floor(Math.random() * 100000) + 1, []);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      if (document.fonts) {
        await Promise.all([
          document.fonts.load('44px "Great Vibes"'),
          document.fonts.load('28px "Courier Prime"'),
        ]).catch(() => {});
        await document.fonts.ready;
      }
      await composeStrip(getCanvas(), { frames, message, handle, seed });
      if (!cancelled) setSrc(getCanvas().toDataURL("image/png"));
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [frames, message, handle, seed]);

  const blob = () =>
    new Promise<Blob>((resolve, reject) =>
      getCanvas().toBlob((b) => (b ? resolve(b) : reject(new Error("no blob"))), "image/png"),
    );

  const filename = `they2kbooth-${Date.now()}.png`;

  const download = (b: Blob) => {
    const url = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const save = async () => {
    download(await blob());
    toast("saved ✦");
  };

  const share = async () => {
    const b = await blob();
    const file = new File([b], filename, { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "THEy2Kbooth." });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(getCanvas().toDataURL("image/png"));
      toast("copied ✦");
    } catch {
      download(b);
      toast("saving to downloads ✦");
    }
  };

  const upload = async () => {
    const b = await blob();
    const picker = (window as any).showSaveFilePicker;
    if (picker) {
      try {
        const handleFile = await picker({
          suggestedName: filename,
          types: [{ description: "PNG image", accept: { "image/png": [".png"] } }],
        });
        const writable = await handleFile.createWritable();
        await writable.write(b);
        await writable.close();
        toast("uploaded ✦");
        return;
      } catch {
        return;
      }
    }
    download(b);
    toast("saving to downloads ✦");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center gap-12 px-8 py-12">
      <div className="relative flex-1">
        {src && (
          <img
            src={src}
            alt="your photo strip"
            className="animate-pop mx-auto max-h-[85vh] w-auto rounded-md shadow-[0_50px_90px_-40px_#000]"
          />
        )}
      </div>

      <div className="w-[320px] shrink-0">
        <h2 className="font-display text-4xl text-leopard-cream">your strip ✦</h2>
        <p className="mt-2 text-xs text-film-sepia/70">stamp it with something good.</p>

        <label className="mt-6 block text-[11px] tracking-[0.25em] text-leopard-tan uppercase">
          message
        </label>
        <input
          value={message}
          maxLength={32}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="photobooth"
          className="mt-2 w-full rounded-xl border border-border bg-surface/70 px-4 py-3 text-leopard-cream outline-none focus:border-leopard-tan"
        />

        <label className="mt-5 block text-[11px] tracking-[0.25em] text-leopard-tan uppercase">
          handle
        </label>
        <input
          value={handle}
          maxLength={20}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@you"
          className="mt-2 w-full rounded-xl border border-border bg-surface/70 px-4 py-3 text-leopard-cream outline-none focus:border-leopard-tan"
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={save}
            className="rounded-full border border-leopard-tan/60 px-6 py-3 text-sm text-leopard-cream transition-colors hover:bg-leopard-tan/15"
          >
            save it
          </button>
          <button
            onClick={share}
            className="rounded-full bg-leopard-tan px-6 py-3 text-sm text-ink transition-transform hover:scale-105"
          >
            share it
          </button>
          <button
            onClick={upload}
            className="rounded-full border border-leopard-tan/60 px-6 py-3 text-sm text-leopard-cream transition-colors hover:bg-leopard-tan/15"
          >
            ↑ upload it
          </button>
        </div>

        <button
          onClick={onRestart}
          className="mt-6 text-sm text-film-sepia/70 underline underline-offset-4 hover:text-leopard-cream"
        >
          do it again
        </button>
      </div>
    </div>
  );
}
