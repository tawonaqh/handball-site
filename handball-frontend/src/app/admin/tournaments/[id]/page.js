'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id;
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTournament() {
      try {
        const data = await fetcher(`tournaments/${tournamentId}`);
        setTournament(data);
      } catch (error) {
        console.error('Error loading tournament:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTournament();
  }, [tournamentId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tournament?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tournaments/${tournamentId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        }
      });

      if (response.ok) {
        alert('Tournament deleted successfully');
        router.push('/admin/tournaments');
      } else {
        alert('Failed to delete tournament');
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
      alert('Error deleting tournament');
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
          <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading tournament...</p>
        </motion.div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Tournament not found</p>
          <Link href="/admin/tournaments">
            <button className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl">
              Back to Tournaments
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/tournaments">
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Tournament Details</h1>
            <p className="text-gray-400 mt-1">View tournament information</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href={`/admin/tournaments/${tournamentId}/edit`}>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden"
      >
        <div className="relative h-48 bg-gradient-to-br from-orange-500/20 to-orange-600/20">
          <div className="w-full h-full flex items-center justify-center">
            <Trophy className="w-24 h-24 text-orange-500/50" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          <div className="absolute bottom-6 left-6">
            <h2 className="text-3xl font-bold text-white mb-2">{tournament.name}</h2>
            <p className="text-xl text-orange-300">Tournament</p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Start Date</p>
                <p className="text-white font-semibold">
                  {tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : 'TBD'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">End Date</p>
                <p className="text-white font-semibold">
                  {tournament.end_date ? new Date(tournament.end_date).toLocaleDateString() : 'TBD'}
                </p>
              </div>
            </div>
          </div>

          {tournament.leagues && tournament.leagues.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4">Leagues</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tournament.leagues.map((league) => (
                  <Link key={league.id} href={`/admin/leagues/${league.id}`}>
                    <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <Trophy className="w-8 h-8 text-orange-400" />
                      <div>
                        <p className="text-white font-semibold">{league.name}</p>
                        <p className="text-sm text-gray-400">{league.teams?.length || 0} teams</p>
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
