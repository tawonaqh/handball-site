"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { RefreshCw, GitBranch, Calendar } from "lucide-react";
import { getBracket, generateBracket, generateFixtures, getWildcardTable, recalculateStandings } from "@/lib/api";
import BracketView from "@/components/tournament/BracketView";
import WildcardTable from "@/components/tournament/WildcardTable";

export default function LeagueBracketPage() {
  const { id } = useParams();
  const [league, setLeague] = useState(null);
  const [bracket, setBracket] = useState(null);
  const [wildcards, setWildcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Generate form state
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

  const handleGenerateBracket = async () => {
    const ids = teamIds.split(",").map((s) => parseInt(s.trim())).filter(Boolean);
    if (!ids.length || !startDate) {
      setMessage({ type: "error", text: "Enter team IDs (comma-separated) and a start date." });
      return;
    }
    setGenerating(true);
    setMessage(null);
    try {
      await generateBracket(id, ids, startDate);
      const b = await getBracket(id);
      setBracket(b);
      setMessage({ type: "success", text: "Bracket generated successfully." });
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateFixtures = async () => {
    const ids = teamIds.split(",").map((s) => parseInt(s.trim())).filter(Boolean);
    if (!ids.length || !startDate) {
      setMessage({ type: "error", text: "Enter team IDs (comma-separated) and a start date." });
      return;
    }
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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{league?.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Type: <span className="font-medium capitalize">{league?.type ?? "league"}</span> ·
            Fixture: <span className="font-medium capitalize">{league?.fixture_type ?? "single"}</span>
          </p>
        </div>
        <button
          onClick={handleRecalculate}
          disabled={recalculating}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${recalculating ? "animate-spin" : ""}`} />
          Recalculate Standings
        </button>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* Generate panel */}
      <div className="card-modern">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-orange-500" />
          Generate Fixtures / Bracket
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team IDs (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. 1, 2, 3, 4"
              value={teamIds}
              onChange={(e) => setTeamIds(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleGenerateFixtures}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {generating && <RefreshCw className="w-4 h-4 animate-spin" />}
            Generate Round-Robin
          </button>
          <button
            onClick={handleGenerateBracket}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {generating && <RefreshCw className="w-4 h-4 animate-spin" />}
            Generate Knockout Bracket
          </button>
        </div>
      </div>

      {/* Bracket visualization */}
      {bracket?.rounds?.length > 0 && (
        <div className="card-modern">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-orange-500" />
            Bracket
          </h2>
          <BracketView bracket={bracket} />
        </div>
      )}

      {/* Wildcard table */}
      {wildcards.length > 0 && <WildcardTable wildcards={wildcards} qualifyCount={4} />}
    </div>
  );
}
