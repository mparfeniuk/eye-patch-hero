// Simple sound effects using Web Audio API

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
  }
  return audioContext;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine"
): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + duration
    );

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.error("Error playing sound:", error);
  }
}

export function playSound(type: "click" | "success" | "miss" | "error"): void {
  switch (type) {
    case "click":
      playTone(800, 0.1, "sine");
      break;
    case "success":
      playTone(600, 0.2, "sine");
      setTimeout(() => playTone(800, 0.2, "sine"), 100);
      break;
    case "miss":
      playTone(300, 0.2, "sawtooth");
      break;
    case "error":
      playTone(200, 0.3, "square");
      break;
  }
}
