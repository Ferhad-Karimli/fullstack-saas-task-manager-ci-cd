import React, { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

type ApiError = { message?: string };

export default function Signup() {
  const [userName, setUserName] = useState(""); // backend-də userName varsa
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName, 
          email,
          password,
        }),
      });

      // backend bəzən plain text, bəzən json qaytarır—ona görə təhlükəsiz oxuyuruq
      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg =
          (data as ApiError)?.message ||
          text ||
          `Signup failed (HTTP ${res.status})`;
        setErr(msg);
        return;
      }

      setSuccess("Qeydiyyat uğurludur. İndi login ola bilərsən.");

      // Router varsa buranı istifadə et. Router yoxdursa, sadəcə success göstərir.
      // window.location.href = "/login";
    } catch (e: any) {
      setErr(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Sign up</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create new account and manage your tasks.
        </p>

        {err && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
              placeholder="məs: ali_99"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
              placeholder="məs: ali@mail.com"
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
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
            />
            <p className="mt-1 text-xs text-slate-500">
              Minumum 6 symvols requiered.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-white font-medium hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Göndərilir..." : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-600">
          Do you have an account?{" "}
          <a className="font-medium text-slate-900 hover:underline" href="/login">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
