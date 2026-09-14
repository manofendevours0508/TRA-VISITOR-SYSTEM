import { Link, useNavigate } from 'react-router-dom';

export default function KioskLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-tra-black text-white px-8 py-5 flex items-center justify-between shadow border-b-4 border-tra-yellow">
        <button
          onClick={() => navigate('/')}
          className="text-2xl font-bold tracking-wide"
        >
          TANZANIA <span className="text-tra-yellow">REVENUE AUTHORITY</span>
        </button>
        <nav className="flex gap-6 text-lg">
          <Link to="/" className="hover:text-tra-yellow">Home</Link>
          <Link to="/map" className="hover:text-tra-yellow">Building Map</Link>
          <Link to="/announcements" className="hover:text-tra-yellow">Announcements</Link>
        </nav>
      </header>
      <main className="flex-1 px-8 py-8">{children}</main>
      <footer className="bg-tra-black text-white text-center py-3 text-sm">
        TRA-DIRECT — Digital Registry, Office Directory and Visitor Guidance System
      </footer>
    </div>
  );
}
