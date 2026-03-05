'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Edit, Trash2, Trophy, User, Hash } from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id;
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const data = await fetcher(`teams/${teamId}`);
        setTeam(data);
      } catch (error) {
        console.error('Error loading team:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTeam();
  }, [teamId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        }
      });

      if (response.ok) {
        alert('Team deleted successfully');
        router.push('/admin/teams');
      } else {
        alert('Failed to delete team');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Error deleting team');
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
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading team...</p>
        </motion.div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Team not found</p>
          <Link href="/admin/teams">
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl">
              Back to Teams
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
          <Link href="/admin/teams">
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Team Details</h1>
            <p className="text-gray-400 mt-1">View team information</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href={`/admin/teams/${teamId}/edit`}>
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

      {/* Team Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden"
      >
        {/* Header with Logo */}
        <div className="relative h-48 bg-gradient-to-br from-green-500/20 to-green-600/20">
          {team.logo_url ? (
            <div className="w-full h-full bg-white p-8">
              <img
                src={team.logo_url}
                alt={team.name}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users className="w-24 h-24 text-green-500/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          <div className="absolute bottom-6 left-6">
            <h2 className="text-3xl font-bold text-white mb-2">{team.name}</h2>
            <p className="text-xl text-green-300">{team.league?.name || 'Independent'}</p>
          </div>
        </div>

        {/* Details */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gray-700/30 rounded-xl">
              <div className="text-4xl font-bold text-green-400 mb-2">{team.ranking?.points || 0}</div>
              <div className="text-sm text-gray-400">Points</div>
            </div>
            <div className="text-center p-6 bg-gray-700/30 rounded-xl">
              <div className="text-4xl font-bold text-green-400 mb-2">{team.ranking?.wins || 0}</div>
              <div className="text-sm text-gray-400">Wins</div>
            </div>
            <div className="text-center p-6 bg-gray-700/30 rounded-xl">
              <div className="text-4xl font-bold text-green-400 mb-2">{team.players?.length || 0}</div>
              <div className="text-sm text-gray-400">Players</div>
            </div>
          </div>

          {/* Players List */}
          {team.players && team.players.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <User className="w-6 h-6 text-green-400" />
                <span>Team Roster</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.players.map((player) => (
                  <Link key={player.id} href={`/admin/players/${player.id}`}>
                    <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        {player.jersey_number ? (
                          <span className="text-green-400 font-bold">#{player.jersey_number}</span>
                        ) : (
                          <User className="w-6 h-6 text-green-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{player.name}</p>
                        <p className="text-sm text-gray-400">{player.position || 'Player'}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
