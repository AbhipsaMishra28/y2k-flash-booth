import { leopardPattern } from "@/lib/booth/stickers";

const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(leopardPattern())}")`;

export function LeopardBackground({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ backgroundImage: url, backgroundSize: "220px 220px", opacity }}
    />
  );
}
