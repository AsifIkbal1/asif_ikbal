// Embedded Base64 Audio to guarantee immediate zero-network, zero-cache playback
export const NOTIFY_AUDIO_DATA = "/bubble-notify.mp3";
export const SUCCESS_AUDIO_DATA = "/order-success.mp3";

let notifyAudioEl: HTMLAudioElement | null = null;
let successAudioEl: HTMLAudioElement | null = null;
let unlocked = false;

function getNotifyAudio(): HTMLAudioElement {
  if (!notifyAudioEl && typeof window !== "undefined") {
    notifyAudioEl = new Audio("/bubble-notify.mp3");
    notifyAudioEl.volume = 1;
    notifyAudioEl.preload = "auto";
  }
  return notifyAudioEl!;
}

function getSuccessAudio(): HTMLAudioElement {
  if (!successAudioEl && typeof window !== "undefined") {
    successAudioEl = new Audio("/order-success.mp3");
    successAudioEl.volume = 1;
    successAudioEl.preload = "auto";
  }
  return successAudioEl!;
}

export function initAudioUnlock() {
  if (typeof window === "undefined" || unlocked) return;

  const unlock = () => {
    unlocked = true;
    try {
      const a = getNotifyAudio();
      a.load();
      const b = getSuccessAudio();
      b.load();
    } catch {}
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("touchstart", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("click", unlock);
  };

  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("touchstart", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });
  window.addEventListener("click", unlock, { passive: true });
}

export function playNotifySound() {
  try {
    const a = getNotifyAudio();
    a.currentTime = 0;
    const res = a.play();
    if (res && typeof res.catch === "function") {
      res.catch((e) => {
        console.warn("Autoplay audio blocked by browser policy, waiting for first click:", e);
        const retry = () => {
          a.currentTime = 0;
          a.play().catch(() => {});
          window.removeEventListener("click", retry);
          window.removeEventListener("touchstart", retry);
        };
        window.addEventListener("click", retry, { once: true, passive: true });
        window.addEventListener("touchstart", retry, { once: true, passive: true });
      });
    }
  } catch (err) {
    console.error("playNotifySound error:", err);
  }
}

export function playOrderSuccessSound() {
  try {
    const b = getSuccessAudio();
    b.currentTime = 0;
    const res = b.play();
    if (res && typeof res.catch === "function") {
      res.catch((e) => {
        console.warn("Order success audio play blocked:", e);
      });
    }
  } catch (err) {
    console.error("playOrderSuccessSound error:", err);
  }
}
