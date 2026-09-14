import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/staff/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-tra-black flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-tra-yellow rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-tra-black mb-1"><span className="bg-tra-black text-tra-yellow px-1">TRA</span>-DIRECT</h1>
        <p className="text-tra-black text-sm mb-6">Staff Registry Portal</p>

        {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

        <label className="block text-sm font-medium text-tra-black mb-1">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-tra-black rounded-lg px-3 py-2 mb-4 bg-white outline-none focus:ring-2 focus:ring-tra-black"
          autoFocus
        />

        <label className="block text-sm font-medium text-tra-black mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-tra-black rounded-lg px-3 py-2 mb-6 bg-white outline-none focus:ring-2 focus:ring-tra-black"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-tra-black text-tra-yellow py-2.5 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
