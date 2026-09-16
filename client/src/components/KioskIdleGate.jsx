import useIdleTimer from '../hooks/useIdleTimer';
import AttractScreen from './AttractScreen';

const IDLE_TIMEOUT_MS = 2 * 60 * 1000;

export default function KioskIdleGate({ children }) {
  const isIdle = useIdleTimer(IDLE_TIMEOUT_MS);

  return (
    <>
      {children}
      {isIdle && <AttractScreen />}
    </>
  );
}
