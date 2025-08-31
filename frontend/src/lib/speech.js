export function useSpeech({ lang = "en-IN", onResult, onStart, onEnd } = {}) {
  const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  let rec = null;

  function start() {
    if (!supported) return;
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    rec = new R();
    rec.lang = lang;
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => onStart && onStart();
    rec.onend = () => onEnd && onEnd();
    rec.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join(" ");
      onResult && onResult(text);
    };
    rec.start();
  }
  function stop() { try { rec && rec.stop(); } catch {} }
  return { start, stop, supported };
}
