"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, RefreshCw, ArrowLeft } from "lucide-react";
import { editGameScore, getMatchSheet } from "@/lib/api";
import MatchSheet from "@/components/tournament/MatchSheet";

export default function EditScorePage() {
  const { id } = useParams();
  const router = useRouter();

  const [game, setGame] = useState(null);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [sheet, setSheet] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/games/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setGame(data);
        setHomeScore(data.home_score ?? "");
        setAwayScore(data.away_score ?? "");
      });

    if (id) {
      getMatchSheet(id)
        .then(setSheet)
        .catch(() => {});
    }
  }, [id]);

  const handleSave = async () => {
    if (homeScore === "" || awayScore === "") return;
    setSaving(true);
    setMessage(null);
    try {
      const result = await editGameScore(id, Number(homeScore), Number(awayScore));
      setMessage({ type: "success", text: "Score updated and standings recalculated." });
      // Refresh match sheet
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
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="card-modern">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Scoreline</h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 text-right">
            <div className="text-sm text-gray-500 mb-1">{game.homeTeam?.name ?? "Home"}</div>
            <input
              type="number"
              min="0"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              className="w-full text-center text-3xl font-black border-2 border-gray-200 rounded-xl p-3 focus:border-orange-400 focus:outline-none"
            />
          </div>

          <div className="text-2xl font-bold text-gray-400 pt-6">–</div>

          <div className="flex-1">
            <div className="text-sm text-gray-500 mb-1">{game.awayTeam?.name ?? "Away"}</div>
            <input
              type="number"
              min="0"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              className="w-full text-center text-3xl font-black border-2 border-gray-200 rounded-xl p-3 focus:border-orange-400 focus:outline-none"
            />
          </div>
        </div>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save & Recalculate"}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          Saving will trigger a full standings recalculation for this league.
        </p>
      </div>

      {/* Match sheet preview */}
      {sheet && <MatchSheet sheet={sheet} />}
    </div>
  );
}
