'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Edit, Trash2, Users, Calendar } from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';
import TournamentStructure from '@/components/tournament/TournamentStructure';

export default function LeagueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leagueId = params.id;
  const [league, setLeague] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeague() {
      try {
        const [leagueData, standingsData] = await Promise.all([
          fetcher(`leagues/${leagueId}`),
          fetcher(`leagues/${leagueId}/standings`).catch(() => [])
        ]);
        setLeague(leagueData);
        setStandings(standingsData || []);
      } catch (error) {
        console.error('Error loading league:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLeague();
  }, [leagueId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this league?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leagues/${leagueId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        }
      });

      if (response.ok) {
        alert('League deleted successfully');
        router.push('/admin/leagues');
      } else {
        alert('Failed to delete league');
      }
    } catch (error) {
      console.error('Error deleting league:', error);
      alert('Error deleting league');
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
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading league...</p>
        </motion.div>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">League not found</p>
          <Link href="/admin/leagues">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              Back to Leagues
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
          <Link href="/admin/leagues">
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
          <Link href={`/admin/leagues/${leagueId}/edit`}>
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
        <div className="relative h-48 bg-gradient-to-br from-blue-500/20 to-blue-600/20">
          <div className="w-full h-full flex items-center justify-center">
            <Trophy className="w-24 h-24 text-blue-500/50" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          <div className="absolute bottom-6 left-6">
            <h2 className="text-3xl font-bold text-white mb-2">{league.name}</h2>
            <p className="text-xl text-blue-300">{league.tournament?.name || 'League'}</p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Type</p>
                <p className="text-white font-semibold capitalize">
                  {league.type === 'knockout' ? 'Knockout' : 'League'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Teams</p>
                <p className="text-white font-semibold">
                  {league.teams?.length || 0}
                  {league.max_teams && ` / ${league.max_teams}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Season</p>
                <p className="text-white font-semibold">{league.season || new Date().getFullYear()}</p>
              </div>
            </div>
          </div>

          {/* Knockout Configuration Display */}
          {league.type === 'knockout' && (league.num_groups || league.teams_per_group || league.knockout_rounds) && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Knockout Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {league.num_groups && (
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Number of Groups</p>
                    <p className="text-2xl font-bold text-purple-300">{league.num_groups}</p>
                  </div>
                )}
                {league.teams_per_group && (
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Teams per Group</p>
                    <p className="text-2xl font-bold text-purple-300">{league.teams_per_group}</p>
                  </div>
                )}
                {league.knockout_rounds && (
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Knockout Stage</p>
                    <p className="text-lg font-bold text-purple-300 capitalize">
                      {league.knockout_rounds.replace(/_/g, ' ')}
                    </p>
                  </div>
                )}
              </div>
              {league.num_groups && league.teams_per_group && (
                <div className="mt-4 bg-gray-700/30 rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-purple-300">Total Capacity:</span>{' '}
                    {league.num_groups * league.teams_per_group} teams
                    {' '}({league.num_groups} groups × {league.teams_per_group} teams)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tournament Structure / Standings */}
          <div className="mt-8">
            <TournamentStructure tournament={league} standings={standings} />
          </div>

          {/* Teams List (for reference) */}
          {league.teams && league.teams.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4">All Teams</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {league.teams.map((team) => (
                  <Link key={team.id} href={`/admin/teams/${team.id}`}>
                    <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <Users className="w-8 h-8 text-blue-400" />
                      <div>
                        <p className="text-white font-semibold">{team.name}</p>
                        <p className="text-sm text-gray-400">View team details</p>
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
