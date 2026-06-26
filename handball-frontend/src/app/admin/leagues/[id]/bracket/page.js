"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { RefreshCw, GitBranch, Settings, Shuffle, ArrowUpDown, FileText } from "lucide-react";
import { getBracket, generateBracket, generateFixtures, getWildcardTable, recalculateStandings } from "@/lib/api";
import BracketView from "@/components/tournament/BracketView";
import WildcardTable from "@/components/tournament/WildcardTable";

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-400">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border-2 border-gray-700 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-500 bg-gray-800 text-gray-100 placeholder-gray-500 touch-manipulation";

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

  // Settings
  const [settings, setSettings] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSeeding, setShowSeeding] = useState(false);
  const [seedingOrder, setSeedingOrder] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [knockoutMethod, setKnockoutMethod] = useState("default");
  const [teamList, setTeamList] = useState([]);

  // Tiebreaker editing
  const [tiebreakerOrder, setTiebreakerOrder] = useState([]);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    Promise.all([
      fetch(`${API}/leagues/${id}`).then((r) => r.json()),
      fetch(`${API}/leagues/${id}/settings`).then((r) => r.json()),
      getBracket(id).catch(() => null),
      getWildcardTable(id).catch(() => []),
    ]).then(([l, s, b, w]) => {
      setLeague(l);
      setSettings(s);
      setKnockoutMethod(s?.knockout_method || "default");
      setTiebreakerOrder(s?.tiebreaker_order || []);
      setBracket(b);
      setWildcards(Array.isArray(w) ? w : []);
      setLoading(false);
    });
  }, [id, API]);

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
      let orderedIds = [...ids];
      if (knockoutMethod === "manual" && seedingOrder.length === ids.length) {
        const orderSet = new Set(seedingOrder);
        const idsSet = new Set(ids);
        if (orderSet.size === idsSet.size && [...orderSet].every((x) => idsSet.has(x))) {
          orderedIds = seedingOrder;
        }
      }
      await generateBracket(id, orderedIds, startDate);
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

  // Settings
  const openSettings = async () => {
    try {
      const res = await fetch(`${API}/leagues/${id}/settings`);
      const s = await res.json();
      setSettings(s);
      setTiebreakerOrder(s.tiebreaker_order || []);
      setKnockoutMethod(s.knockout_method || "default");
      setShowSettings(true);
    } catch (e) {
      setMessage({ type: "error", text: "Failed to load settings" });
    }
  };

  const saveSettings = async () => {
    try {
      const res = await fetch(`${API}/leagues/${id}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, tiebreaker_order: tiebreakerOrder, knockout_method: knockoutMethod }),
      });
      if (res.ok) {
        setShowSettings(false);
        setMessage({ type: "success", text: "Settings saved." });
      }
    } catch (e) {
      setMessage({ type: "error", text: "Failed to save settings" });
    }
  };

  const moveTiebreaker = (index, dir) => {
    const order = [...tiebreakerOrder];
    const ni = index + dir;
    if (ni < 0 || ni >= order.length) return;
    [order[index], order[ni]] = [order[ni], order[index]];
    setTiebreakerOrder(order);
  };

  // Manual Seeding
  const openSeeding = async () => {
    const ids = getTeamIds();
    if (ids.length < 2) {
      setMessage({ type: "error", text: "Enter at least 2 team IDs first." });
      return;
    }
    try {
      const res = await fetch(`${API}/teams`);
      const allTeams = await res.json();
      const filtered = allTeams.filter((t) => ids.includes(t.id));
      const sorted = [...filtered].sort((a, b) => (b.ranking?.points || 0) - (a.ranking?.points || 0));
      setTeamList(sorted);
      if (seedingOrder.length === ids.length) {
        const orderSet = new Set(seedingOrder);
        const idsSet = new Set(ids);
        if (!(orderSet.size === idsSet.size && [...orderSet].every((x) => idsSet.has(x)))) {
          setSeedingOrder(sorted.map((t) => t.id));
        }
      } else {
        setSeedingOrder(sorted.map((t) => t.id));
      }
      setKnockoutMethod("manual");
      setShowSeeding(true);
    } catch (e) {
      setMessage({ type: "error", text: "Failed to load teams" });
    }
  };

  const moveSeed = (index, dir) => {
    const order = [...seedingOrder];
    const ni = index + dir;
    if (ni < 0 || ni >= order.length) return;
    [order[index], order[ni]] = [order[ni], order[index]];
    setSeedingOrder(order);
  };

  const resetSeeding = () => {
    const ids = getTeamIds();
    if (!ids.length) return;
    const sorted = [...teamList].sort((a, b) => (b.ranking?.points || 0) - (a.ranking?.points || 0));
    setSeedingOrder(sorted.map((t) => t.id));
  };

  const applySeeding = () => {
    setShowSeeding(false);
    setMessage({ type: "success", text: `Seeding set (${seedingOrder.length} teams). Click "Generate Knockout Bracket" to apply.` });
  };

  // Drag and drop
  const handleDragStart = (idx) => setDragIndex(idx);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (idx) => {
    if (dragIndex === null || dragIndex === idx) return;
    const order = [...seedingOrder];
    const [removed] = order.splice(dragIndex, 1);
    order.splice(idx, 0, removed);
    setSeedingOrder(order);
    setDragIndex(null);
  };

  // Bracket preview pairs
  const getPreviewPairs = () => {
    const ids = getTeamIds();
    if (!ids.length || seedingOrder.length < 2) return [];
    const n = seedingOrder.length;
    const pairs = [];
    for (let i = 0; i < Math.floor(n / 2); i++) {
      pairs.push([seedingOrder[i], seedingOrder[n - 1 - i]]);
    }
    return pairs;
  };

  const getTeamName = (teamId) => {
    const t = teamList.find((t) => t.id === teamId);
    return t ? t.name : `#${teamId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  const pairs = getPreviewPairs();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-100">{league?.name}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            <span className="capitalize">{league?.type ?? "league"}</span>
            {" · "}
            <span className="capitalize">{league?.fixture_type ?? "single"} fixture</span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={openSettings} className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-semibold border border-gray-700">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button onClick={handleRecalculate} disabled={recalculating} className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-semibold disabled:opacity-50 border border-gray-700">
            <RefreshCw className={`w-4 h-4 ${recalculating ? "animate-spin" : ""}`} />
            Recalculate
          </button>
          <a href={`${API}/leagues/${id}/rulebook`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-900/40 text-blue-300 rounded-xl text-sm font-semibold hover:bg-blue-800/50 border border-blue-700/40">
            <FileText className="w-4 h-4" /> Rulebook
          </a>
        </div>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
          message.type === "success" ? "bg-green-900/30 text-green-300 border border-green-700/50" : "bg-red-900/30 text-red-300 border border-red-700/50"
        }`}>
          {message.text}
        </div>
      )}

      {/* Generate panel */}
      <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 p-5 space-y-4">
        <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-orange-400" />
          Generate Fixtures / Bracket
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <Field label="Team IDs (comma-separated)">
            <input type="text" inputMode="numeric" placeholder="e.g. 1, 2, 3, 4" value={teamIds} onChange={(e) => setTeamIds(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Start Date">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
          </Field>
        </div>

        {/* Knockout method selector */}
        {teamIds.trim() && getTeamIds().length >= 2 && (
          <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-700">
            <span className="text-sm font-semibold text-gray-400">Knockout method:</span>
            <select value={knockoutMethod} onChange={(e) => setKnockoutMethod(e.target.value)}
              className="flex-1 min-w-[160px] border-2 border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500 bg-gray-800 text-gray-100">
              <option value="default" className="bg-gray-800">Default (Best vs Worst)</option>
              <option value="manual" className="bg-gray-800">Manual Seeding</option>
              <option value="crossGroup" className="bg-gray-800">Cross-Group Pairing</option>
            </select>
            <button onClick={openSeeding} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-500">
              <ArrowUpDown className="w-4 h-4" /> Seed
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={handleGenerateFixtures} disabled={generating}
            className="flex items-center justify-center gap-2 py-4 bg-blue-600 active:bg-blue-500 text-white font-bold rounded-2xl disabled:opacity-50 hover:bg-blue-500 transition-colors">
            {generating && <RefreshCw className="w-4 h-4 animate-spin" />}
            Generate Round-Robin
          </button>
          <button onClick={handleGenerateBracket} disabled={generating}
            className="flex items-center justify-center gap-2 py-4 bg-orange-600 active:bg-orange-500 text-white font-bold rounded-2xl disabled:opacity-50 hover:bg-orange-500 transition-colors">
            {generating && <RefreshCw className="w-4 h-4 animate-spin" />}
            Generate Knockout Bracket
          </button>
        </div>
      </div>

      {/* Bracket visualization */}
      {bracket?.rounds?.length > 0 && (
        <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 p-5">
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-2 mb-4">
            <GitBranch className="w-5 h-5 text-orange-400" /> Bracket
          </h2>
          <BracketView bracket={bracket} />
        </div>
      )}

      {wildcards.length > 0 && <WildcardTable wildcards={wildcards} qualifyCount={4} />}

      {/* Settings modal */}
      {showSettings && settings && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2"><Settings className="w-5 h-5 text-orange-400" /> Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-2xl text-gray-500 hover:text-gray-300">&times;</button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <Field label="Match Duration">
                  <input type="number" value={settings.match_duration} onChange={(e) => setSettings({ ...settings, match_duration: +e.target.value })} className={inputCls} />
                </Field>
                <Field label="Overtime Halves">
                  <input type="number" value={settings.overtime_halves} onChange={(e) => setSettings({ ...settings, overtime_halves: +e.target.value })} className={inputCls} />
                </Field>
                <Field label="Roster Limit">
                  <input type="number" value={settings.roster_limit} onChange={(e) => setSettings({ ...settings, roster_limit: +e.target.value })} className={inputCls} />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Win Pts">
                  <input type="number" value={league?.win_points ?? 2} disabled className={inputCls + " opacity-60"} />
                </Field>
                <Field label="Draw Pts">
                  <input type="number" value={league?.draw_points ?? 1} disabled className={inputCls + " opacity-60"} />
                </Field>
                <Field label="Loss Pts">
                  <input type="number" value={league?.loss_points ?? 0} disabled className={inputCls + " opacity-60"} />
                </Field>
              </div>

              <Field label="Shootout">
                <select value={settings.shootout_enabled} onChange={(e) => setSettings({ ...settings, shootout_enabled: e.target.value })}
                  className={inputCls}>
                  <option value="yes" className="bg-gray-800">Yes (after overtime)</option>
                  <option value="no" className="bg-gray-800">No (tie stands)</option>
                </select>
              </Field>

              <div>
                <label className="text-sm font-semibold text-gray-400 block mb-2">Tiebreaker Order</label>
                <ul className="space-y-1">
                  {tiebreakerOrder.map((tb, i) => (
                    <li key={i} className="flex items-center gap-2 p-2 bg-gray-900/50 rounded-lg border-l-4 border-orange-500">
                      <span className="font-bold text-orange-400 min-w-[24px]">{i + 1}.</span>
                      <span className="flex-1 text-sm text-gray-200">{tb}</span>
                      <button disabled={i === 0} onClick={() => moveTiebreaker(i, -1)} className="px-2 py-1 text-sm border border-gray-600 rounded hover:bg-gray-700 disabled:opacity-30 text-gray-300">&uarr;</button>
                      <button disabled={i === tiebreakerOrder.length - 1} onClick={() => moveTiebreaker(i, 1)} className="px-2 py-1 text-sm border border-gray-600 rounded hover:bg-gray-700 disabled:opacity-30 text-gray-300">&darr;</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setShowSettings(false)} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-semibold">Cancel</button>
              <button onClick={saveSettings} className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Manual seeding modal */}
      {showSeeding && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowSeeding(false)}>
          <div className="bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2"><Shuffle className="w-5 h-5 text-orange-400" /> Manual Seeding</h2>
              <button onClick={() => setShowSeeding(false)} className="text-2xl text-gray-500 hover:text-gray-300">&times;</button>
            </div>
            <p className="text-sm text-gray-400 mb-4">Drag rows or use arrows to reorder. 1st seed vs last seed, 2nd vs 2nd-last, etc.</p>

            <div className="flex gap-6 flex-wrap">
              <div className="flex-1 min-w-[280px]">
                {seedingOrder.map((tid, idx) => {
                  const t = teamList.find((x) => x.id === tid);
                  return (
                    <div key={tid}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(idx)}
                      className={`flex items-center gap-3 p-3 mb-2 rounded-xl border-2 cursor-grab active:cursor-grabbing transition-all
                        ${dragIndex === idx ? "opacity-50 border-dashed border-gray-500" : "border-gray-700 hover:border-orange-500 bg-gray-900/50"}`}>
                      <span className="text-gray-500 text-lg">&#x2630;</span>
                      <span className="font-bold text-orange-400 bg-orange-900/30 px-2 py-0.5 rounded-full text-sm min-w-[28px] text-center">#{idx + 1}</span>
                      <span className="flex-1 font-semibold text-gray-200">{t?.name || `#${tid}`}</span>
                      <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">{t?.ranking?.points || 0} pts</span>
                      <div className="flex gap-1">
                        <button disabled={idx === 0} onClick={() => moveSeed(idx, -1)} className="px-2 py-1 text-sm border border-gray-600 rounded hover:bg-gray-700 disabled:opacity-30 text-gray-300">&uarr;</button>
                        <button disabled={idx === seedingOrder.length - 1} onClick={() => moveSeed(idx, 1)} className="px-2 py-1 text-sm border border-gray-600 rounded hover:bg-gray-700 disabled:opacity-30 text-gray-300">&darr;</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bracket preview */}
              <div className="w-full sm:w-64 bg-gray-900 rounded-xl p-4 h-fit border border-gray-700">
                <h4 className="text-sm font-bold text-orange-400 text-center mb-3 pb-2 border-b-2 border-orange-500">Bracket Preview</h4>
                {pairs.map((pair, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-800 px-3 py-2 mb-1.5 rounded-lg text-sm border-l-4 border-orange-500">
                    <span><span className="font-bold text-orange-400">{seedingOrder.indexOf(pair[0]) + 1}</span> <span className="text-gray-200">{getTeamName(pair[0])}</span></span>
                    <span className="text-gray-500 mx-1">vs</span>
                    <span className="text-gray-200">{getTeamName(pair[1])} <span className="font-bold text-orange-400">{seedingOrder.indexOf(pair[1]) + 1}</span></span>
                  </div>
                ))}
                {pairs.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Need at least 2 teams</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={resetSeeding} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-semibold">Reset</button>
              <button onClick={() => setShowSeeding(false)} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-semibold">Cancel</button>
              <button onClick={applySeeding} className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold">Apply Seeding</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
