import React, { useEffect, useState } from "react";
import { apiFetch, clearToken } from "../lib/api";
import { useNavigate } from "react-router-dom";

type Task = {
  _id: string;
  title: string;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

export default function Tasks() {
  const nav = useNavigate();
  const [items, setItems] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const data = await apiFetch("/tasks"); // ✅ Bearer token header avtomatik əlavə olunur
      setItems(data?.items || []);
    } catch (e: any) {
      // Token expired/invalid olsa backend 401 verəcək
      if (String(e?.message || "").includes("401")) {
        clearToken();
        nav("/login", { replace: true });
        return;
      }
      setErr(e?.message || "Failed to load tasks");
    }
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({ title, priority: "MEDIUM" }),
      });
      setTitle("");
      load();
    } catch (e: any) {
      setErr(e?.message || "Failed to create task");
    }
  }

  async function toggleTask(id: string, completed: boolean) {
    setErr(null);
    try {
      await apiFetch(`/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: !completed }),
      });
      load();
    } catch (e: any) {
      setErr(e?.message || "Failed to update task");
    }
  }

  async function deleteTask(id: string) {
    setErr(null);
    try {
      await apiFetch(`/tasks/${id}`, { method: "DELETE" });
      load();
    } catch (e: any) {
      setErr(e?.message || "Failed to delete task");
    }
  }

  function logout() {
    clearToken();
    nav("/login", { replace: true });
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
          <button
            onClick={logout}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-100"
          >
            Logout
          </button>
        </div>

        {err && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <form onSubmit={createTask} className="mt-6 flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-900"
            placeholder="New task title..."
            required
          />
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-white font-medium hover:bg-slate-800">
            Add
          </button>
        </form>

        <div className="mt-6 space-y-2">
          {items.map((t) => (
            <div key={t._id} className="rounded-2xl bg-white shadow p-4 flex items-center justify-between">
              <div>
                <div className={`font-medium ${t.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                  {t.title}
                </div>
                <div className="text-xs text-slate-500">Priority: {t.priority}</div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleTask(t._id, t.completed)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-100"
                >
                  {t.completed ? "Undo" : "Done"}
                </button>
                <button
                  onClick={() => deleteTask(t._id)}
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="mt-6 text-sm text-slate-600">Hələ task yoxdur.</div>
          )}
        </div>
      </div>
    </div>
  );
}
