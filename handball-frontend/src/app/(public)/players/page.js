"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaUser, FaThLarge, FaList, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import PlayerCard from "@/components/cards/PlayerCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const TABS = [
  { key: "all", label: "All Players" },
  { key: "men", label: "Men" },
  { key: "women", label: "Women" },
];

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    async function fetchData() {
      try {
        const [playersData, teamsData] = await Promise.all([
          fetcher("players"),
          fetcher("teams"),
        ]);
        setPlayers(playersData || []);
        setTeams(teamsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading players..." />;
  if (error) return <ErrorBoundary error={error} retry={() => window.location.reload()} />;

  const filtered = players.filter(p => {
    const matchesGender = activeTab === "all" || (p.gender || "men") === activeTab;
    const matchesTeam = !selectedTeam || p.team_id?.toString() === selectedTeam || p.team?.id?.toString() === selectedTeam;
    return matchesGender && matchesTeam;
  });

  const menCount = players.filter(p => (p.gender || "men") === "men").length;
  const womenCount = players.filter(p => p.gender === "women").length;

  return (
    <ErrorBoundary>
      <div className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20">
        <div className="container mx-auto px-4 sm:px-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4 sm:mb-6">
              <FaUser />
              <span className="font-semibold">Players</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
              Handball Players
            </h1>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the talented athletes making waves in Zimbabwean handball
            </p>
          </motion.div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 sm:mb-10">
            {/* Gender Tabs */}
            <div className="inline-flex bg-gray-100 rounded-2xl p-1 gap-1">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.key
                      ? tab.key === "women"
                        ? "bg-pink-500 text-white shadow"
                        : tab.key === "men"
                        ? "bg-blue-500 text-white shadow"
                        : "bg-orange-500 text-white shadow"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  {tab.key === "men" && <span className="ml-1.5 text-xs opacity-80">({menCount})</span>}
                  {tab.key === "women" && <span className="ml-1.5 text-xs opacity-80">({womenCount})</span>}
                  {tab.key === "all" && <span className="ml-1.5 text-xs opacity-80">({players.length})</span>}
                </button>
              ))}
            </div>

            {/* Club Filter */}
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent cursor-pointer"
            >
              <option value="">All Clubs</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg text-sm transition-all ${
                  viewMode === "grid" ? "bg-white text-orange-600 shadow" : "text-gray-500 hover:text-gray-700"
                }`}
                title="Grid view"
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg text-sm transition-all ${
                  viewMode === "list" ? "bg-white text-orange-600 shadow" : "text-gray-500 hover:text-gray-700"
                }`}
                title="List view"
              >
                <FaList />
              </button>
            </div>
          </div>

          {/* Players Grid / List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8">
              {filtered.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-3">
              {filtered.map((player) => (
                <Link key={player.id} href={`/players/${player.id}`}>
                  <div className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold shrink-0">
                      {player.jersey_number || <FaUser />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                        {player.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-3">
                        <span>{player.team?.name || "Free Agent"}</span>
                        {player.position && <><span className="w-1 h-1 rounded-full bg-gray-300" /><span>{player.position}</span></>}
                      </div>
                    </div>
                    <div className="flex items-center gap-5 text-center shrink-0">
                      <div>
                        <div className="text-lg font-bold text-gray-900">{player.goals || 0}</div>
                        <div className="text-xs text-gray-400">Goals</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{player.assists || 0}</div>
                        <div className="text-xs text-gray-400">Assists</div>
                      </div>
                      <FaArrowRight className="text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <FaUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No players found</h3>
              <p className="text-gray-500">
                {activeTab !== "all" ? `No ${activeTab === "women" ? "women's" : "men's"} players registered yet` : "Check back later for player updates"}
              </p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
