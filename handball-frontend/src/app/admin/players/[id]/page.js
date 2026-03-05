'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Edit, Trash2, Users, Hash, MapPin, Calendar, Activity, Award } from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

export default function PlayerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const playerId = params.id;
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlayer() {
      try {
        const data = await fetcher(`players/${playerId}`);
        setPlayer(data);
      } catch (error) {
        console.error('Error loading player:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPlayer();
  }, [playerId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this player?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/players/${playerId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        }
      });

      if (response.ok) {
        alert('Player deleted successfully');
        router.push('/admin/players');
      } else {
        alert('Failed to delete player');
      }
    } catch (error) {
      console.error('Error deleting player:', error);
      alert('Error deleting player');
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
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading player...</p>
        </motion.div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Player not found</p>
          <Link href="/admin/players">
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
              Back to Players
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/players">
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Player Profile</h1>
            <p className="text-gray-400 mt-1">View player information</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href={`/admin/players/${playerId}/edit`}>
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

      {/* Player Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden"
      >
        {/* Header with Photo */}
        <div className="relative h-64 bg-gradient-to-br from-purple-500/20 to-purple-600/20">
          {player.photo_url ? (
            <img
              src={player.photo_url}
              alt={player.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-24 h-24 text-purple-500/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          {player.jersey_number && (
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-purple-500/80 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-2xl">#{player.jersey_number}</span>
            </div>
          )}
          
          <div className="absolute bottom-6 left-6">
            <h2 className="text-3xl font-bold text-white mb-2">{player.name}</h2>
            <p className="text-xl text-purple-300">{player.position || 'Player'}</p>
          </div>
        </div>

        {/* Details */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Team</p>
                <p className="text-white font-semibold">{player.team?.name || 'No team'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Hash className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Jersey Number</p>
                <p className="text-white font-semibold">#{player.jersey_number || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Position</p>
                <p className="text-white font-semibold">{player.position || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Activity className="w-6 h-6 text-purple-400" />
              <span>Statistics</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-700/30 rounded-xl">
                <div className="text-4xl font-bold text-purple-400 mb-2">{player.goals || 0}</div>
                <div className="text-sm text-gray-400">Goals</div>
              </div>
              <div className="text-center p-6 bg-gray-700/30 rounded-xl">
                <div className="text-4xl font-bold text-purple-400 mb-2">{player.assists || 0}</div>
                <div className="text-sm text-gray-400">Assists</div>
              </div>
              <div className="text-center p-6 bg-gray-700/30 rounded-xl">
                <div className="text-4xl font-bold text-purple-400 mb-2">{player.matches_played || 0}</div>
                <div className="text-sm text-gray-400">Matches Played</div>
              </div>
            </div>
          </div>

          {/* Biography */}
          {player.bio && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Biography</h3>
              <p className="text-gray-300 leading-relaxed">{player.bio}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
