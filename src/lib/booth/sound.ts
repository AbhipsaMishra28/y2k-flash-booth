let ctx: AudioContext | null = null;

export function unlockAudio() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as any).webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx?.state === "suspended") void ctx.resume();
}

export function shutterClick() {
  if (!ctx) return;
  const now = ctx.currentTime;
  const dur = 0.06;
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 4);
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.value = 0.35;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2400;
  src.connect(filter).connect(gain).connect(ctx.destination);
  src.start(now);
}

export function ding() {
  if (!ctx) return;
  const now = ctx.currentTime;
  [880, 1320].forEach((freq, i) => {
    const osc = ctx!.createOscillator();
    const gain = ctx!.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + i * 0.09);
    gain.gain.linearRampToValueAtTime(0.18, now + i * 0.09 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.6);
    osc.connect(gain).connect(ctx!.destination);
    osc.start(now + i * 0.09);
    osc.stop(now + i * 0.09 + 0.7);
  });
}
