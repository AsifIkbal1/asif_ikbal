export const NOTIFY_AUDIO_DATA = "/bubble-notify.mp3";
export const SUCCESS_AUDIO_DATA = "/order-success.mp3";

let audioCtx: AudioContext | null = null;
let notifyBuffer: AudioBuffer | null = null;
let isAudioContextLoading = false;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  return audioCtx;
}

// Pre-fetch and decode the notification MP3 as an AudioBuffer
async function loadNotifyBuffer(): Promise<AudioBuffer | null> {
  if (notifyBuffer) return notifyBuffer;
  if (isAudioContextLoading) return null;
  isAudioContextLoading = true;
  try {
    const ctx = getContext();
    if (!ctx) return null;
    const res = await fetch("/bubble-notify.mp3");
    const arrayBuf = await res.arrayBuffer();
    notifyBuffer = await ctx.decodeAudioData(arrayBuf);
    return notifyBuffer;
  } catch (e) {
    return null;
  } finally {
    isAudioContextLoading = false;
  }
}

// Background sound via Web Audio API synth (Zero-click guaranteed fallback chime)
function playSyntheticPop(ctx: AudioContext) {
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Bubble pop frequency sweep
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.08);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  } catch {}
}

export function initAudioUnlock() {
  if (typeof window === "undefined") return;
  loadNotifyBuffer().catch(() => {});
}

export function playNotifySound() {
  // Strategy 1: HTML5 Audio Direct Play (Works if browser allows autoplay on domain)
  try {
    const a = new Audio("/bubble-notify.mp3");
    a.volume = 1;
    const p = a.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        // Success with regular audio
        return;
      }).catch(async () => {
        // Strategy 2: Web Audio API Buffer playback
        const ctx = getContext();
        if (ctx) {
          if (ctx.state === "suspended") {
            await ctx.resume().catch(() => {});
          }
          const buf = await loadNotifyBuffer();
          if (buf && ctx.state === "running") {
            const src = ctx.createBufferSource();
            src.buffer = buf;
            src.connect(ctx.destination);
            src.start(0);
          } else {
            // Strategy 3: Synthetic audio pop
            playSyntheticPop(ctx);
          }
        }
      });
    }
  } catch (err) {
    const ctx = getContext();
    if (ctx) playSyntheticPop(ctx);
  }
}

export function playOrderSuccessSound() {
  try {
    const audio = new Audio("/order-success.mp3");
    audio.volume = 1;
    audio.play().catch(() => {});
  } catch {}
}
