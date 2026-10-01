import { useEffect, useState } from 'react';
import SlideProgressBar from './SlideProgressBar';

const LOCATION_SLIDE_DURATION_MS = 10000;
const FONT = "'Crimson Pro', 'Minion Pro', Georgia, serif";

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const LOCATIONS = [
  {
    key: 'dodoma-1',
    name: 'DODOMA DISTRICT',
    start: 1,
    wards: [
      'Uhuru',
      'Viwandani',
      'Makole',
      'Madukani',
      'Majengo',
      'Chamwino',
      'K/Ndege',
      "Nghtong'onha",
      'Miyuji',
      'Dodoma Makulu',
      'Ntyuka',
      'Tambukireli',
      'Ikilimani',
    ],
  },
  {
    key: 'dodoma-2',
    name: 'DODOMA DISTRICT',
    start: 14,
    wards: [
      'Kikuyu kaskazini',
      'Kikuyu kusini',
      'Mpunge',
      'Mtabele',
      'Matumbulu',
      'Mkonze',
      'Chigongwe',
      'Nala',
      'Zuzu',
      'Mbalawala',
      'Nkota',
      'Hazina',
      'Nzuguni',
    ],
  },
  {
    key: 'nzuguni',
    name: 'NZUGUNI CENTRE',
    start: 27,
    wards: [
      'Mtumba',
      'Ihumwa',
      'Ipagala',
      'Kikombo',
      'Hombolo Bwawani',
      'Hombolo Makulu',
      'Chinangali',
      'Chahwa',
      'Ipala',
      'Miyuji',
      'Makutupora',
      'Mpunguzi',
    ],
  },
  {
    key: 'mipango',
    name: 'MIPANGO CENTRE',
    start: 36,
    wards: ['Miyuji', 'Makutupora', 'Msalato', "Chang'ombe", 'Nkuhungu'],
  },
  // Local sub-areas within specific wards, sourced from the registry's own
  // handwritten area notes rather than the printed ward table above — shown
  // as branches of their ward rather than numbered wards in their own right.
  {
    key: 'majengo-areas',
    name: 'MAJENGO',
    type: 'areas',
    start: 1,
    wards: ['Kipande Street', 'Bahi Road', 'Zone A', 'Kizota', 'Nala', 'Mnada Mpya', 'Mdoka (Machinjio)', 'Kitenge', "Chang'ombe", 'Zuzu'],
  },
  {
    key: 'miyuji-areas',
    name: 'MIYUJI',
    type: 'areas',
    start: 1,
    wards: ['Wotenzi', 'Mtaji Street', 'Vemula (Area B)', 'Msalato'],
  },
  {
    key: 'tambuka-reli-areas',
    name: 'TAMBUKA RELI',
    type: 'areas',
    start: 1,
    wards: ['Chibachi', 'Mkonze', 'Chichichi', 'Kikuyu', 'Ngondomha', 'Mtyuka', 'Chinyoya', 'Dodoma Makulu', 'Kilimani', 'Hazina', 'Iringa Road', 'Makulu'],
  },
  {
    key: 'ipagara-nzuguni-areas',
    name: 'IPAGARA / NZUGUNI',
    type: 'areas',
    start: 1,
    wards: ['Simba Sukuma', 'Ipagara', 'Kwaja', 'Ntumba', 'Homboro', 'Ihumwa', 'Kikombo', 'Nyumba 300'],
  },
  {
    key: 'uhuru-areas',
    name: 'UHURU',
    type: 'areas',
    start: 1,
    wards: ['Baruti', 'Mji Mpya', 'Mkanda Bar', 'Ntendem'],
  },
  {
    key: 'viwandani-areas',
    name: 'VIWANDANI',
    type: 'areas',
    start: 1,
    wards: ['Sasasaga', 'Makole', 'CBE', 'Samali', 'Jamhuri', 'Tofiki', 'Chakomcheko'],
  },
  {
    key: 'madukani-areas',
    name: 'MADUKANI',
    type: 'areas',
    start: 1,
    wards: Array.from({ length: 11 }, (_, i) => `Barabara ya ${i + 1}`),
  },
];

function MapPin({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 21.2C9 17.6 5.6 13.6 5.6 9.6a6.4 6.4 0 0 1 12.8 0c0 4-3.4 8-6.4 11.6Z" />
      <circle cx="12" cy="9.6" r="2.6" />
    </svg>
  );
}

function Radar({ className }) {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={className}
      aria-hidden="true"
    >
      <circle cx="160" cy="160" r="70" />
      <circle cx="160" cy="160" r="120" />
      <circle cx="160" cy="160" r="170" />
      <path d="M160 20v280M20 160h280" />
    </svg>
  );
}

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

function WardCard({ n, ward }) {
  return (
    <li className="flex items-center gap-2.5 rounded-lg bg-tra-yellow px-3 py-2 shadow-sm">
      <span className="shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full bg-tra-black text-tra-yellow text-sm font-bold flex items-center justify-center">
        {n}
      </span>
      <span className="font-bold text-tra-black text-base md:text-lg truncate">{ward}</span>
    </li>
  );
}

export default function LocationSlideshow() {
  const [pageIndex, setPageIndex] = useState(0);
  const now = useNow();

  useEffect(() => {
    if (LOCATIONS.length < 2) return;
    const timer = setInterval(() => {
      setPageIndex((i) => (i + 1) % LOCATIONS.length);
    }, LOCATION_SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, []);

  const page = LOCATIONS[pageIndex];

  const leftColumn = page.wards
    .map((ward, i) => ({ ward, n: page.start + i }))
    .filter(({ n }) => n % 2 === 1);
  const rightColumn = page.wards
    .map((ward, i) => ({ ward, n: page.start + i }))
    .filter(({ n }) => n % 2 === 0);

  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const day = DAYS[now.getDay()];
  const dateISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;

  return (
    <div className="relative h-full w-full overflow-hidden bg-white text-tra-black">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-2 left-3 w-10 h-10 border-t-2 border-l-2 border-tra-black/10" />
        <div className="absolute bottom-2 right-3 w-10 h-10 border-b-2 border-r-2 border-tra-black/10" />
        <Radar className="absolute -bottom-14 -right-14 w-52 text-tra-black opacity-[0.04]" />
        <MapPin className="absolute bottom-6 right-8 w-9 h-9 text-tra-yellow opacity-30" />
      </div>

      {LOCATIONS.length > 1 && (
        <SlideProgressBar duration={LOCATION_SLIDE_DURATION_MS} slideKey={page.key} className="relative z-10" />
      )}

      <div className="relative z-10 flex flex-col h-full">
        <header className="shrink-0 flex items-center justify-between gap-3 px-4 pt-3 md:px-5">
          <div className="min-w-0 flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0 text-tra-yellow" />
            <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.3em] text-tra-black">
              Location Information
            </span>
          </div>

          <div
            className="shrink-0 flex flex-col items-center justify-center rounded-md border border-tra-yellow/40 px-4 py-1.5 md:py-2 shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
            style={{ background: 'linear-gradient(180deg, #16191D 0%, #050606 100%)' }}
          >
            <div className="text-xl md:text-3xl font-extrabold leading-none text-tra-yellow tabular-nums">
              {time}
            </div>
            <div className="mt-1 text-[10px] md:text-xs font-bold uppercase tracking-widest text-tra-yellow">
              {day}
            </div>
            <div className="mt-0.5 text-[10px] md:text-xs font-semibold tracking-widest text-white/85 tabular-nums">
              {dateISO}
            </div>
          </div>
        </header>

        <div key={page.key} className="panel-fade flex-1 flex flex-col min-h-0">
          <div className="shrink-0 mt-5 text-center px-4">
            <div
              className="mx-auto inline-block bg-tra-yellow px-6 py-1.5 md:py-2 text-2xl md:text-4xl font-extrabold uppercase tracking-wide text-tra-black shadow-sm"
              style={{ fontFamily: FONT }}
            >
              {page.name}
            </div>
            <div className="mt-3 inline-flex items-center gap-2 text-tra-black text-sm md:text-base font-semibold uppercase tracking-[0.25em]">
              {page.type === 'areas'
                ? 'LOCAL AREAS'
                : `WARDS ${page.start}–${page.start + page.wards.length - 1}`}
            </div>
          </div>

          <div className="shrink-0 mt-3 flex items-center justify-center gap-2 px-10">
            <span className="h-px flex-1 bg-tra-black/15" />
            <span className="w-1.5 h-1.5 rotate-45 bg-tra-yellow" />
            <span className="h-px flex-1 bg-tra-black/15" />
          </div>

          <main className="flex-1 flex items-start justify-center px-5 md:px-9 py-4 min-h-0 overflow-hidden">
            <div className="flex w-full max-w-3xl gap-2 md:gap-3 mx-auto">
              <ol className="flex-1 space-y-2 md:space-y-2.5 min-w-0">
                {leftColumn.map(({ ward, n }) => (
                  <WardCard key={ward + n} n={n} ward={ward} />
                ))}
              </ol>
              <ol className="flex-1 space-y-2 md:space-y-2.5 min-w-0">
                {rightColumn.map(({ ward, n }) => (
                  <WardCard key={ward + n} n={n} ward={ward} />
                ))}
              </ol>
            </div>
          </main>

          <footer className="shrink-0 flex justify-center gap-2 pb-5">
            {LOCATIONS.map((p, i) => (
              <span
                key={p.key}
                className={`h-2 rounded-full transition-all ${
                  i === pageIndex ? 'w-8 bg-tra-yellow' : 'w-2 bg-black/15'
                }`}
              />
            ))}
          </footer>
        </div>
      </div>
    </div>
  );
}