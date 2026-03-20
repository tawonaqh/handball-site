"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const data = await fetcher("players");
        setPlayers(data || []);
      } catch (error) {
        console.error("Error fetching players:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, []);

  if (loading) return <LoadingSpinner message="Loading players..." />;
  if (error) return <ErrorBoundary error={error} retry={() => window.location.reload()} />;

  const filtered = activeTab === "all"
    ? players
    : players.filter(p => (p.gender || "men") === activeTab);

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

          {/* Gender Tabs */}
          <div className="flex justify-center mb-8 sm:mb-10">
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
          </div>

          {/* Players Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8">
            {filtered.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>

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
