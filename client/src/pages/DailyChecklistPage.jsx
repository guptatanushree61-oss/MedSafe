import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiLoader, FiX } from "react-icons/fi";
import { getMedicine, updateMedicine } from "../lib/api.js";

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

function normalizeChecklist(raw) {
  const out = {};
  for (const key of DAY_KEYS) {
    const v = raw?.[key];
    out[key] = v === "taken" || v === "missed" || v === "unset" ? v : "unset";
  }
  return out;
}

export default function DailyChecklistPage() {
  const { medicineId } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [checklist, setChecklist] = useState(() => normalizeChecklist({}));
  const [loading, setLoading] = useState(true);
  const [savingDay, setSavingDay] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!medicineId) return;
    setLoading(true);
    setError("");
    try {
      const doc = await getMedicine(medicineId);
      setMedicine(doc);
      setChecklist(normalizeChecklist(doc.weeklyChecklist));
    } catch {
      setError("Could not load this medicine.");
      setMedicine(null);
    } finally {
      setLoading(false);
    }
  }, [medicineId]);

  useEffect(() => {
    load();
  }, [load]);

  const persist = async (next) => {
    if (!medicineId) return;
    setSavingDay("all");
    try {
      const updated = await updateMedicine(medicineId, { weeklyChecklist: next });
      setMedicine(updated);
      setChecklist(normalizeChecklist(updated.weeklyChecklist));
    } catch {
      setError("Could not save. Please try again.");
    } finally {
      setSavingDay(null);
    }
  };

  const setDayStatus = async (day, status) => {
    const next = { ...checklist, [day]: status };
    setChecklist(next);
    if (!medicineId) return;
    setSavingDay(day);
    setError("");
    try {
      const updated = await updateMedicine(medicineId, { weeklyChecklist: next });
      setMedicine(updated);
      setChecklist(normalizeChecklist(updated.weeklyChecklist));
    } catch {
      setError("Could not save. Please try again.");
      await load();
    } finally {
      setSavingDay(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center text-black/60">
        <FiLoader className="mx-auto animate-spin text-2xl" />
        <p className="mt-2 text-sm">Loading checklist…</p>
      </div>
    );
  }

  if (error && !medicine) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-black/60">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm text-white"
        >
          <FiArrowLeft /> Back to dashboard
        </button>
      </div>
    );
  }

  const savingAny = savingDay !== null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-black/60 hover:text-black"
          >
            <FiArrowLeft /> Dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Daily checklist</h1>
          <p className="mt-1 text-lg font-medium text-black/80">{medicine?.name}</p>
          <p className="mt-1 text-sm text-black/60">
            For each day, mark whether you took this medicine (✓) or missed it (✗). Use “Clear” to reset a day.
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white">
        <ul className="divide-y divide-black/10">
          {DAY_KEYS.map((day) => {
            const status = checklist[day];
            const busy = savingDay === day;
            return (
              <li
                key={day}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium text-black/90">{DAY_LABELS[day]}</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={savingAny}
                    onClick={() => setDayStatus(day, "taken")}
                    title="Taken"
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      status === "taken"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-black/15 bg-white text-black/70 hover:bg-black/[0.03]"
                    }`}
                  >
                    {busy ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <FiCheck className="text-emerald-600" />
                    )}
                    Taken
                  </button>
                  <button
                    type="button"
                    disabled={savingAny}
                    onClick={() => setDayStatus(day, "missed")}
                    title="Missed"
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      status === "missed"
                        ? "border-red-500 bg-red-50 text-red-800"
                        : "border-black/15 bg-white text-black/70 hover:bg-black/[0.03]"
                    }`}
                  >
                    <FiX className="text-red-600" />
                    Missed
                  </button>
                  <button
                    type="button"
                    disabled={savingAny}
                    onClick={() => setDayStatus(day, "unset")}
                    title="Clear"
                    className="rounded-lg border border-black/10 px-3 py-2 text-sm text-black/60 hover:bg-black/[0.04]"
                  >
                    Clear
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 rounded-md border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
        >
          <FiArrowLeft /> Back to dashboard
        </button>
        <button
          type="button"
          disabled={savingAny}
          onClick={() => persist(normalizeChecklist({}))}
          className="inline-flex items-center gap-2 rounded-md border border-black/15 px-4 py-2 text-sm text-black/70 hover:bg-black/5 disabled:opacity-50"
        >
          {savingDay === "all" ? (
            <>
              <FiLoader className="animate-spin" /> Resetting…
            </>
          ) : (
            "Reset week"
          )}
        </button>
      </div>
    </div>
  );
}
