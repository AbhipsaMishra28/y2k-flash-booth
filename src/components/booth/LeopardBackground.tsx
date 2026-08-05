import bg from "@/assets/leopard-halftone-bg.jpg";

export function LeopardBackground({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})`, opacity }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-background/55"
      />
    </>
  );
}
