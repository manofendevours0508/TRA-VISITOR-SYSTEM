import { useEffect, useState } from 'react';
import useIdleTimer from '../hooks/useIdleTimer';
import AttractScreen from './AttractScreen';
import WelcomeAnimation from './WelcomeAnimation';

const IDLE_TIMEOUT_MS = 5 * 1000;
const WELCOME_DURATION_MS = 3000;

export default function KioskIdleGate({ children }) {
  const isIdle = useIdleTimer(IDLE_TIMEOUT_MS);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (!isIdle) return;
    setShowWelcome(true);
    const timer = setTimeout(() => setShowWelcome(false), WELCOME_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isIdle]);

  return (
    <>
      {children}
      {isIdle && (showWelcome ? <WelcomeAnimation /> : <AttractScreen />)}
    </>
  );
}
