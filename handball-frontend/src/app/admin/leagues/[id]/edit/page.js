'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, Save, ArrowLeft } from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

export default function EditLeaguePage() {
  const params = useParams();
  const router = useRouter();
  const leagueId = params.id;
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [tournaments, setTournaments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    tournament_id: "",
    gender: "men",
    type: "league",
    max_teams: "",
    num_groups: "",
    teams_per_group: "",
    knockout_rounds: ""
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [leagueData, tournamentsData] = await Promise.all([
          fetcher(`leagues/${leagueId}`),
          fetcher('tournaments')
        ]);
        
        setFormData({
          name: leagueData.name || "",
          tournament_id: leagueData.tournament_id || "",
          gender: leagueData.gender || "men",
          type: leagueData.type || "league",
          max_teams: leagueData.max_teams || "",
          num_groups: leagueData.num_groups || "",
          teams_per_group: leagueData.teams_per_group || "",
          knockout_rounds: leagueData.knockout_rounds || ""
        });
        setTournaments(tournamentsData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load league data');
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, [leagueId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leagues/${leagueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('League updated successfully!');
        router.push(`/admin/leagues/${leagueId}`);
      } else {
        alert('Failed to update league');
      }
    } catch (error) {
      console.error('Error updating league:', error);
      alert('Error updating league');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading league data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Link href={`/admin/leagues/${leagueId}`}>
            <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-blue-500" />
              <span>Edit Tournament</span>
            </h1>
            <p className="text-gray-400 mt-1">Update tournament information</p>
          </div>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tournament Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Premier League"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tournament Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="league">League (Standings)</option>
              <option value="knockout">Knockout (Groups + Elimination)</option>
            </select>
            <p className="text-xs text-gray-400 mt-2">
              {formData.type === 'league'
                ? 'Teams compete in a round-robin format with standings based on points'
                : 'Teams compete in groups, then advance to knockout rounds'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="men">Men's</option>
              <option value="women">Women's</option>
            </select>
            <p className="text-xs text-gray-400 mt-2">Which gender category this tournament is for</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Maximum Teams
            </label>
            <input
              type="number"
              name="max_teams"
              value={formData.max_teams}
              onChange={handleChange}
              min="2"
              placeholder="e.g., 16"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <p className="text-xs text-gray-400 mt-1">Maximum number of teams allowed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tournament
            </label>
            <select
              name="tournament_id"
              value={formData.tournament_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">Select tournament (optional)</option>
              {tournaments.map(tournament => (
                <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
              ))}
            </select>
          </div>
        </div>

        {formData.type === 'knockout' && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Knockout Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Groups
                </label>
                <input
                  type="number"
                  name="num_groups"
                  value={formData.num_groups}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g., 4"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <p className="text-xs text-gray-400 mt-1">Groups in group stage</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Teams per Group
                </label>
                <input
                  type="number"
                  name="teams_per_group"
                  value={formData.teams_per_group}
                  onChange={handleChange}
                  min="2"
                  placeholder="e.g., 4"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <p className="text-xs text-gray-400 mt-1">Teams in each group</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Knockout Rounds
                </label>
                <select
                  name="knockout_rounds"
                  value={formData.knockout_rounds}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="">Auto (based on teams)</option>
                  <option value="round_of_16">Round of 16</option>
                  <option value="quarter_finals">Quarter Finals (8 teams)</option>
                  <option value="semi_finals">Semi Finals (4 teams)</option>
                  <option value="finals">Finals Only (2 teams)</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">Starting knockout stage</p>
              </div>
            </div>

            {formData.num_groups && formData.teams_per_group && (
              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-purple-300">Total Teams:</span>{' '}
                  {parseInt(formData.num_groups || 0) * parseInt(formData.teams_per_group || 0)} teams
                  {' '}({formData.num_groups} groups × {formData.teams_per_group} teams)
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Updating...' : 'Update Tournament'}
          </button>
          <Link href={`/admin/leagues/${leagueId}`} className="flex-1">
            <button
              type="button"
              className="w-full px-6 py-3 bg-gray-700/50 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </Link>
        </div>
      </motion.form>
    </div>
  );
}
