"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { RefreshCw, GitBranch, Calendar, ChevronDown } from "lucide-react";
import { getBracket, generateBracket, generateFixtures, getWildcardTable, recalculateStandings } from "@/lib/api";
import BracketView from "@/components/tournament/BracketView";
import WildcardTable from "@/components/tournament/WildcardTable";

/** Shared mobile-optimised label + input wrapper */
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-600">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-400 bg-white touch-manipulation";

export default function LeagueBracketPage() {
  const { id } = useParams();
  const [league, setLeague] = useState(null);
  const [bracket, setBracket] = useState(null);
  const [wildcards, setWildcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [teamIds, setTeamIds] = useState("");
  const [generating, setGenerating] = useState(false);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leagues/${id}`).then((r) => r.json()),
      getBracket(id).catch(() => null),
      getWildcardTable(id).catch(() => []),
    ]).then(([l, b, w]) => {
      setLeague(l);
      setBracket(b);
      setWildcards(Array.isArray(w) ? w : []);
      setLoading(false);
    });
  }, [id]);

  const getTeamIds = () =>
    teamIds.split(",").map((s) => parseInt(s.trim())).filter(Boolean);

  const validate = () => {
    const ids = getTeamIds();
    if (!ids.length || !startDate) {
      setMessage({ type: "error", text: "Enter team IDs and a start date." });
      return null;
    }
    return ids;
  };

  const handleGenerateFixtures = async () => {
    const ids = validate();
    if (!ids) return;
    setGenerating(true);
    setMessage(null);
    try {
      await generateFixtures(id, ids, startDate);
      setMessage({ type: "success", text: `Round-robin fixtures generated (${league?.fixture_type ?? "single"} fixture).` });
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateBracket = async () => {
    const ids = validate();
    if (!ids) return;
    setGenerating(true);
    setMessage(null);
    try {
      await generateBracket(id, ids, startDate);
      const b = await getBracket(id);
      setBracket(b);
      setMessage({ type: "success", text: "Knockout bracket generated." });
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setGenerating(false);
    }
  };

  const handleRecalculate = async () => {
    setRecalculating(true);
    setMessage(null);
    try {
      await recalculateStandings(id);
      const w = await getWildcardTable(id).catch(() => []);
      setWildcards(Array.isArray(w) ? w : []);
      setMessage({ type: "success", text: "Standings recalculated." });
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

      {/* Header — stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{league?.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            <span className="capitalize">{league?.type ?? "league"}</span>
            {" · "}
            <span className="capitalize">{league?.fixture_type ?? "single"} fixture</span>
          </p>
        </div>
        <button
          onClick={handleRecalculate}
          disabled={recalculating}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 active:bg-gray-200 rounded-xl text-sm font-semibold transition-colors touch-manipulation w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 ${recalculating ? "animate-spin" : ""}`} />
          Recalculate Standings
        </button>
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

      {/* Generate panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-orange-500" />
          Generate Fixtures / Bracket
        </h2>

        {/* Inputs — full-width stacked, large touch targets */}
        <div className="grid grid-cols-1 gap-4">
          <Field label="Team IDs (comma-separated)">
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 1, 2, 3, 4"
              value={teamIds}
              onChange={(e) => setTeamIds(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Start Date">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        {/* Action buttons — full-width on mobile, side-by-side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleGenerateFixtures}
            disabled={generating}
            className="flex items-center justify-center gap-2 py-4 bg-blue-500 active:bg-blue-600 text-white font-bold rounded-2xl transition-colors disabled:opacity-50 touch-manipulation"
          >
            {generating && <RefreshCw className="w-4 h-4 animate-spin" />}
            Generate Round-Robin
          </button>
          <button
            onClick={handleGenerateBracket}
            disabled={generating}
            className="flex items-center justify-center gap-2 py-4 bg-orange-500 active:bg-orange-600 text-white font-bold rounded-2xl transition-colors disabled:opacity-50 touch-manipulation"
          >
            {generating && <RefreshCw className="w-4 h-4 animate-spin" />}
            Generate Knockout Bracket
          </button>
        </div>
      </div>

      {/* Bracket visualization */}
      {bracket?.rounds?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
            <GitBranch className="w-5 h-5 text-orange-500" />
            Bracket
          </h2>
          <BracketView bracket={bracket} />
        </div>
      )}

      {wildcards.length > 0 && <WildcardTable wildcards={wildcards} qualifyCount={4} />}
    </div>
  );
}
