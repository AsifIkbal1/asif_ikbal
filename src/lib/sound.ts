let audioUnlocked = false;
let globalSuccessAudio: HTMLAudioElement | null = null;
let globalNotifyAudio: HTMLAudioElement | null = null;

export function initAudioUnlock() {
  if (typeof window === "undefined" || audioUnlocked) return;

  const unlock = () => {
    if (audioUnlocked) return;
    audioUnlocked = true;

    try {
      if (!globalSuccessAudio) {
        globalSuccessAudio = new Audio("/order-success.mp3");
        globalSuccessAudio.preload = "auto";
        globalSuccessAudio.load();
      }
      if (!globalNotifyAudio) {
        globalNotifyAudio = new Audio("/bubble-notify.mp3");
        globalNotifyAudio.preload = "auto";
        globalNotifyAudio.load();
      }
    } catch {}

    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  };

  window.addEventListener("pointerdown", unlock, { once: true, passive: true });
  window.addEventListener("keydown", unlock, { once: true, passive: true });
  window.addEventListener("touchstart", unlock, { once: true, passive: true });
}

export function playNotifySound() {
  try {
    const audio = globalNotifyAudio || new Audio("/bubble-notify.mp3");
    audio.currentTime = 0;
    const p = audio.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        // Fallback: wait for user interaction to play
        const onInteract = () => {
          audio.currentTime = 0;
          audio.play().catch(() => {});
          window.removeEventListener("pointerdown", onInteract);
          window.removeEventListener("keydown", onInteract);
        };
        window.addEventListener("pointerdown", onInteract, { once: true, passive: true });
        window.addEventListener("keydown", onInteract, { once: true, passive: true });
      });
    }
  } catch {}
}

export function playOrderSuccessSound() {
  try {
    const audio = globalSuccessAudio || new Audio("/order-success.mp3");
    audio.currentTime = 0;
    const p = audio.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        // If autoplay blocked in async promise chain, play on next frame or user tap
        const retry = () => {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        };
        window.addEventListener("pointerdown", retry, { once: true, passive: true });
      });
    }
  } catch {}
}
