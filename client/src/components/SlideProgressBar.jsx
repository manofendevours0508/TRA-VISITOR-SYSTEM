import { useEffect, useState } from 'react';

// A thin bar that fills over `duration` ms, resetting whenever `slideKey`
// changes — gives the slideshow a visible countdown to the next slide.
export default function SlideProgressBar({ duration, slideKey, className = '' }) {
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    setFilled(false);
    const raf = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(raf);
  }, [slideKey]);

  return (
    <div className={`h-1 w-full bg-tra-black/10 overflow-hidden shrink-0 ${className}`}>
      <div
        className="h-full bg-tra-yellow"
        style={{
          width: filled ? '100%' : '0%',
          transition: filled ? `width ${duration}ms linear` : 'none',
        }}
      />
    </div>
  );
}
