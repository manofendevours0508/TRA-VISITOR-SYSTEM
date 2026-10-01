import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import logoImg from '../assets/tra-logo-official.png';

// Ported from a Claude Design motion composition (TRA Welcome.dc.html),
// with the original photo "Sign" phase dropped (source image had a
// rendering defect) — the reveal choreography now starts at T=0.
const CUES = { Reveal: 0, Hold: 1.2 };
const DURATION = 3;

const Easing = {
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeOutBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};

function animate({ from = 0, to = 1, start = 0, end = 1, ease = Easing.easeInOutCubic }) {
  return (t) => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}

const MOTION = {
  enter: (a, b, s, e) => animate({ from: a, to: b, start: s, end: e, ease: Easing.easeOutCubic }),
  draw: (a, b, s, e) => animate({ from: a, to: b, start: s, end: e, ease: Easing.easeInOutCubic }),
  pop: (a, b, s, e) => animate({ from: a, to: b, start: s, end: e, ease: Easing.easeOutBack }),
};

const Y = '#111111';
const FONT = "'Crimson Pro', 'Minion Pro', Georgia, serif";
const FINAL = { x: 960, y: 320 };
const LOGO_SIZE = 470;

function Stripes({ T, side }) {
  const p = MOTION.draw(0, 1, CUES.Reveal + 0.05, CUES.Reveal + 0.5)(T);
  const inner = 250, len = 720;
  const left = side < 0 ? FINAL.x - inner - len : FINAL.x + inner;
  return (
    <div style={{
      position: 'absolute', left, top: FINAL.y - 24, width: len, display: 'flex', flexDirection: 'column', gap: 9,
      transform: `scaleX(${p})`, transformOrigin: side < 0 ? 'right center' : 'left center',
    }}>
      <div style={{ height: 7, background: Y }} />
      <div style={{ height: 16, background: Y }} />
      <div style={{ height: 7, background: Y }} />
    </div>
  );
}

function Reveal({ T, welcome }) {
  const logoOp = MOTION.enter(0, 1, 0.1, 0.5)(T);
  const bump = MOTION.pop(0.6, 1, 0.1, 0.9)(T);
  const w = LOGO_SIZE, h = LOGO_SIZE;
  const textY = MOTION.enter(100, 0, CUES.Reveal + 0.3, CUES.Reveal + 0.75)(T);
  const rule = MOTION.draw(0, 1, CUES.Reveal + 0.5, CUES.Reveal + 0.95)(T);
  const wOp = MOTION.enter(0, 1, CUES.Reveal + 0.75, CUES.Reveal + 1.1)(T);
  const wY = MOTION.enter(20, 0, CUES.Reveal + 0.75, CUES.Reveal + 1.1)(T);
  return (
    <>
      <Stripes T={T} side={-1} />
      <Stripes T={T} side={1} />
      <img
        src={logoImg}
        alt="TRA"
        style={{
          position: 'absolute', left: FINAL.x - w / 2, top: FINAL.y - h / 2, width: w, height: h,
          opacity: logoOp, transform: `scale(${bump})`,
        }}
      />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 610, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ overflow: 'hidden', paddingBottom: 4 }}>
          <div style={{
            fontFamily: FONT, fontWeight: 700, fontSize: 108, letterSpacing: '0.01em', color: Y, lineHeight: 1.05,
            transform: `translateY(${textY}%)`,
          }}>TANZANIA REVENUE AUTHORITY</div>
        </div>
        <div style={{ width: 1500, height: 6, background: Y, marginTop: 14, transform: `scaleX(${rule})` }} />
        <div style={{
          marginTop: 56, fontFamily: FONT, fontWeight: 600, fontSize: 44, letterSpacing: '0.32em', color: Y,
          opacity: wOp, transform: `translateY(${wY}px)`,
        }}>{welcome}</div>
      </div>
    </>
  );
}

// Scales the 1920x1080 authored canvas to fit the viewport, letterboxed and centered.
function useStageScale() {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setScale(Math.min(el.clientWidth / 1920, el.clientHeight / 1080));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, scale];
}

export default function WelcomeAnimation() {
  const { lang } = useLanguage();
  const welcome = lang === 'sw' ? 'KARIBU' : 'WELCOME';
  const [containerRef, scale] = useStageScale();
  const [T, setT] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    let raf;
    const tick = (now) => {
      setT(Math.min((now - startedAt) / 1000, DURATION));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const push = MOTION.draw(1, 1.035, CUES.Reveal, DURATION)(T);

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden">
      <div style={{ position: 'relative', width: 1920, height: 1080, flexShrink: 0, transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '50% 45%' }}>
          <Reveal T={T} welcome={welcome} />
        </div>
      </div>
    </div>
  );
}
