'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LiveMatchTracker from '@/components/LiveMatchTracker';
import { fetcher } from '@/lib/api';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function LiveMatchPage() {
  const params = useParams();
  const gameId = params.id;
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGame() {
      try {
        // Use the init endpoint which returns real players or existing live data
        const data = await fetcher(`games/${gameId}/init`);
        setGameData(data);
      } catch (error) {
        console.error('Error loading game:', error);
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [gameId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading match...</p>
        </motion.div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Game not found</p>
          <a href="/admin/games" className="text-indigo-500 hover:underline">
            Back to Games
          </a>
        </div>
      </div>
    );
  }

  // Transform init data to match tracker format
  const initialData = {
    time: gameData.time || 0,
    teamAName: gameData.teamAName || "Home Team",
    teamBName: gameData.teamBName || "Away Team",
    playersA: gameData.playersA || [],
    playersB: gameData.playersB || [],
    onCourtA: gameData.onCourtA || [],
    onCourtB: gameData.onCourtB || [],
    activeFouls: gameData.activeFouls || [],
    matchLog: gameData.matchLog || []
  };

  return (
    <div>
      <LiveMatchTracker gameId={gameId} initialData={initialData} />
    </div>
  );
}
