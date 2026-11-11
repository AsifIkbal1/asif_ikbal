export function initAudioUnlock() {
  // no-op
}

export function playOrderSuccessSound() {
  try {
    const audio = new Audio("/order-success.mp3");
    audio.volume = 1;
    audio.play().catch(() => {});
  } catch {}
}
