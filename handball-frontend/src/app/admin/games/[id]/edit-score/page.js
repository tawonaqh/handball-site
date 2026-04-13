"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, RefreshCw, ArrowLeft, Plus, Minus } from "lucide-react";
import { editGameScore, getMatchSheet } from "@/lib/api";
import MatchSheet from "@/components/tournament/MatchSheet";

/** Large +/- stepper — thumb-friendly for on-court use */
function ScoreStepper({ label, value, onChange }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-semibold text-gray-500 text-center leading-tight max-w-[120px] truncate">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-14 h-14 rounded-2xl bg-gray-100 active:bg-gray-200 flex items-center justify-center text-gray-700 touch-manipulation select-none"
          aria-label="Decrease"
        >
          <Minus className="w-6 h-6" />
        </button>
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min="0"
          value={value}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="w-20 h-14 text-center text-4xl font-black border-2 border-gray-200 rounded-2xl focus:border-orange-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-14 h-14 rounded-2xl bg-orange-500 active:bg-orange-600 flex items-center justify-center text-white touch-manipulation select-none"
          aria-label="Increase"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default function EditScorePage() {
  const { id } = useParams();
  const router = useRouter();

  const [game, setGame] = useState(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [sheet, setSheet] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/games/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setGame(data);
        setHomeScore(data.home_score ?? 0);
        setAwayScore(data.away_score ?? 0);
      });

    if (id) getMatchSheet(id).then(setSheet).catch(() => {});
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await editGameScore(id, homeScore, awayScore);
      setMessage({ type: "success", text: "Score updated and standings recalculated." });
      getMatchSheet(id).then(setSheet).catch(() => {});
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  if (!game) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 active:text-gray-800 touch-manipulation"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h1 className="text-xl font-bold text-gray-900 text-center">Edit Scoreline</h1>

        {/* Score steppers — large touch targets */}
        <div className="flex items-center justify-center gap-6">
          <ScoreStepper
            label={game.homeTeam?.name ?? "Home"}
            value={homeScore}
            onChange={setHomeScore}
          />
          <span className="text-3xl font-black text-gray-300 mt-6">–</span>
          <ScoreStepper
            label={game.awayTeam?.name ?? "Away"}
            value={awayScore}
            onChange={setAwayScore}
          />
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        {/* Full-width CTA — easy to tap on court */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 active:bg-orange-600 text-white text-base font-bold rounded-2xl transition-colors disabled:opacity-50 touch-manipulation"
        >
          {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving…" : "Save & Recalculate Standings"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Triggers a full standings recalculation for this league.
        </p>
      </div>

      {sheet && <MatchSheet sheet={sheet} />}
    </div>
  );
}
