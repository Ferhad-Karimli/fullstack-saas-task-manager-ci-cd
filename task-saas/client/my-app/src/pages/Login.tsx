import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setToken } from '../lib/api';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (!res.ok) {
        setErr(data?.message || text || `Login failed (HTTP ${res.status})`);
        return;
      }

      const token = data?.token;
      if (!token) {
        setErr('Token gəlmədi. Backend response-u yoxla.');
        return;
      }

      setToken(token); // ✅ localStorage-a yazır
      nav('/tasks', { replace: true }); // ✅ birbaşa tasks-ə keçir
    } catch (e: any) {
      setErr(e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        <p className="mt-1 text-sm text-slate-600">
          Sign in to your account and manage tasks.
        </p>

        {err && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-white font-medium hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Wait...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-600">
          No account?{' '}
          <Link
            className="font-medium text-slate-900 hover:underline"
            to="/signup"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
