type Props = {
  /** pointer position in viewport px */
  x: number;
  y: number;
  active: boolean;
};

/**
 * Halftone dot grid that ripples toward the pointer/touch position.
 * Purely decorative overlay — never intercepts input.
 */
export function GridWave({ x, y, active }: Props) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-500"
      style={{
        opacity: active ? 1 : 0.35,
        backgroundImage:
          "radial-gradient(circle, var(--leopard-cream) 1.2px, transparent 1.4px)",
        backgroundSize: active ? "22px 22px" : "26px 26px",
        transition: "background-size 400ms ease-out, opacity 500ms ease-out",
        maskImage: `radial-gradient(circle 320px at ${x}px ${y}px, #000 0%, rgba(0,0,0,0.55) 45%, transparent 78%)`,
        WebkitMaskImage: `radial-gradient(circle 320px at ${x}px ${y}px, #000 0%, rgba(0,0,0,0.55) 45%, transparent 78%)`,
      }}
    >
      <div
        className="absolute rounded-full transition-transform duration-300 ease-out"
        style={{
          left: x,
          top: y,
          width: 420,
          height: 420,
          marginLeft: -210,
          marginTop: -210,
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--leopard-tan) 30%, transparent) 0%, transparent 68%)",
          transform: `scale(${active ? 1.15 : 0.8})`,
        }}
      />
    </div>
  );
}
