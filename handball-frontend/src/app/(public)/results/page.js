"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, Filter, Clock, MapPin } from "lucide-react";
import { fetcher } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const FILTERS = [
  { id: "all",   label: "All Results" },
  { id: "today", label: "Today" },
  { id: "week",  label: "This Week" },
  { id: "month", label: "This Month" },
];

function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}
function isThisWeek(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const start = new Date(now); start.setDate(now.getDate() - now.getDay());
  const end   = new Date(start); end.setDate(start.getDate() + 6);
  return d >= start && d <= end;
}
function isThisMonth(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default function ResultsPage() {
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");

  useEffect(() => {
    fetcher("games")
      .then((data) => {
        // Only completed games, newest first
        const completed = (data || [])
          .filter((g) => g.status === "completed")
          .sort((a, b) => new Date(b.match_date) - new Date(a.match_date));
        setResults(completed);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = results.filter((r) => {
    if (filter === "today") return isToday(r.match_date);
    if (filter === "week")  return isThisWeek(r.match_date);
    if (filter === "month") return isThisMonth(r.match_date);
    return true;
  });

  if (loading) return <LoadingSpinner message="Loading results..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <Trophy className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
          <h1 className="text-3xl sm:text-5xl font-bold mb-3">Match Results</h1>
          <p className="text-lg text-white/90 max-w-xl mx-auto">
            Complete archive of all handball match results
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-5 bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all touch-manipulation ${
                  filter === f.id
                    ? "bg-orange-500 text-white shadow"
                    : "bg-gray-100 text-gray-700 active:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results list */}
      <section className="py-10">
        <div className="container mx-auto px-4 space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No results found</p>
            </div>
          )}

          {filtered.map((result, i) => {
            const homeWon = result.home_score > result.away_score;
            const awayWon = result.away_score > result.home_score;
            const draw    = result.home_score === result.away_score;

            return (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Meta row */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(result.match_date).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                    {result.venue && (
                      <span className="hidden sm:flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {result.venue}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {result.league && (
                      <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                        {result.league.name}
                      </span>
                    )}
                    {result.group_label && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        Group {result.group_label}
                      </span>
                    )}
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Final
                    </span>
                  </div>
                </div>

                {/* Score row */}
                <div className="grid grid-cols-3 gap-2 items-center px-4 py-4">
                  {/* Home team */}
                  <div className={`text-right ${homeWon ? "font-black" : "font-semibold"}`}>
                    <p className={`text-sm sm:text-base leading-tight ${homeWon ? "text-gray-900" : "text-gray-500"}`}>
                      {result.home_team?.name ?? "Home"}
                    </p>
                    {homeWon && (
                      <span className="text-[10px] text-green-600 font-bold uppercase">Winner</span>
                    )}
                  </div>

                  {/* Scores */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span className={`text-3xl sm:text-4xl font-black tabular-nums ${homeWon ? "text-gray-900" : "text-gray-400"}`}>
                        {result.home_score ?? "–"}
                      </span>
                      <span className="text-xl text-gray-300 font-light">–</span>
                      <span className={`text-3xl sm:text-4xl font-black tabular-nums ${awayWon ? "text-gray-900" : "text-gray-400"}`}>
                        {result.away_score ?? "–"}
                      </span>
                    </div>
                    {draw && (
                      <span className="text-[10px] text-yellow-600 font-bold uppercase">Draw</span>
                    )}
                  </div>

                  {/* Away team */}
                  <div className={`text-left ${awayWon ? "font-black" : "font-semibold"}`}>
                    <p className={`text-sm sm:text-base leading-tight ${awayWon ? "text-gray-900" : "text-gray-500"}`}>
                      {result.away_team?.name ?? "Away"}
                    </p>
                    {awayWon && (
                      <span className="text-[10px] text-green-600 font-bold uppercase">Winner</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
