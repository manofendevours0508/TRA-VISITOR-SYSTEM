import { useEffect, useRef, useState } from 'react';

const ACTIVITY_EVENTS = ['pointerdown', 'mousemove', 'keydown', 'touchstart', 'wheel'];

// Tracks whether the user has been inactive for `timeoutMs`. Starts idle
// (so the attract screen shows immediately on load) and resets on any
// interaction, going idle again after `timeoutMs` of no activity.
export default function useIdleTimer(timeoutMs) {
  const [isIdle, setIsIdle] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const goIdle = () => setIsIdle(true);

    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(goIdle, timeoutMs);
    };

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer));
    timerRef.current = setTimeout(goIdle, timeoutMs);

    return () => {
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timerRef.current);
    };
  }, [timeoutMs]);

  return isIdle;
}
