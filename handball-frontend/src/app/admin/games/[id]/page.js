'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Edit, Trash2, PlayCircle } from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGame() {
      try {
        const data = await fetcher(`games/${gameId}`);
        setGame(data);
      } catch (error) {
        console.error('Error loading game:', error);
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [gameId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/games/${gameId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Game deleted successfully');
        router.push('/admin/games');
      } else {
        alert('Failed to delete game');
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      alert('Error deleting game');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading game...</p>
        </motion.div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Game not found</p>
          <Link href="/admin/games">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
              Back to Games
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/games">
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Game Details</h1>
            <p className="text-gray-400 mt-1">View game information</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {(game.status === 'scheduled' || game.status === 'live') && (
            <Link href={`/admin/games/${gameId}/live`}>
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                <PlayCircle className="w-5 h-5" />
                <span>Live Tracking</span>
              </button>
            </Link>
          )}
          <Link href={`/admin/games/${gameId}/edit`}>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-xl transition-all">
              <Edit className="w-5 h-5" />
              <span>Edit</span>
            </button>
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Game Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
      >
        {/* Status Badge */}
        <div className="flex justify-end mb-6">
          <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(game.status)}`}>
            {game.status || 'scheduled'}
          </div>
        </div>

        {/* Teams */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {game.home_team?.name || 'Team A'} <span className="text-gray-500">vs</span> {game.away_team?.name || 'Team B'}
          </h2>
          <p className="text-gray-400">{game.league?.name || 'Match'}</p>
        </div>

        {/* Score (if completed) */}
        {game.status === 'completed' && (
          <div className="flex items-center justify-center space-x-8 mb-8 p-6 bg-gray-700/30 rounded-xl">
            <div className="text-center">
              <div className="text-5xl font-black text-white">{game.home_score || 0}</div>
              <div className="text-sm text-gray-400 mt-2">{game.home_team?.name || 'Home'}</div>
            </div>
            <div className="text-3xl text-gray-500 font-bold">-</div>
            <div className="text-center">
              <div className="text-5xl font-black text-white">{game.away_score || 0}</div>
              <div className="text-sm text-gray-400 mt-2">{game.away_team?.name || 'Away'}</div>
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Date</p>
              <p className="text-white font-semibold">
                {game.match_date ? new Date(game.match_date).toLocaleDateString() : 'TBD'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Time</p>
              <p className="text-white font-semibold">{game.match_time || 'TBD'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Venue</p>
              <p className="text-white font-semibold">{game.venue || 'TBD'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Round</p>
              <p className="text-white font-semibold">Round {game.round || 1}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
