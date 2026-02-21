'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

export default function EditGamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    league_id: '',
    home_team_id: '',
    away_team_id: '',
    match_date: '',
    match_time: '',
    venue: '',
    round: 1,
    status: 'scheduled'
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [gameData, leaguesData, teamsData] = await Promise.all([
          fetcher(`games/${gameId}`),
          fetcher('leagues'),
          fetcher('teams')
        ]);
        
        setFormData({
          league_id: gameData.league_id || '',
          home_team_id: gameData.home_team_id || '',
          away_team_id: gameData.away_team_id || '',
          match_date: gameData.match_date || '',
          match_time: gameData.match_time || '',
          venue: gameData.venue || '',
          round: gameData.round || 1,
          status: gameData.status || 'scheduled'
        });
        setLeagues(leaguesData || []);
        setTeams(teamsData || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [gameId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/games/${gameId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Game updated successfully');
        router.push('/admin/games');
      } else {
        alert('Failed to update game');
      }
    } catch (error) {
      console.error('Error updating game:', error);
      alert('Error updating game');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/games">
          <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Game</h1>
          <p className="text-gray-400 mt-1">Update game information</p>
        </div>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 space-y-6"
      >
        {/* League */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">League</label>
          <select
            value={formData.league_id}
            onChange={(e) => setFormData({ ...formData, league_id: e.target.value })}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select League</option>
            {leagues.map(league => (
              <option key={league.id} value={league.id}>{league.name}</option>
            ))}
          </select>
        </div>

        {/* Teams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Home Team</label>
            <select
              value={formData.home_team_id}
              onChange={(e) => setFormData({ ...formData, home_team_id: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Home Team</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Away Team</label>
            <select
              value={formData.away_team_id}
              onChange={(e) => setFormData({ ...formData, away_team_id: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Away Team</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Match Date</label>
            <input
              type="date"
              value={formData.match_date}
              onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Match Time</label>
            <input
              type="time"
              value={formData.match_time}
              onChange={(e) => setFormData({ ...formData, match_time: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Venue & Round */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Venue</label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="Enter venue"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Round</label>
            <input
              type="number"
              value={formData.round}
              onChange={(e) => setFormData({ ...formData, round: parseInt(e.target.value) })}
              min="1"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="postponed">Postponed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href="/admin/games">
            <button
              type="button"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </motion.form>
    </div>
  );
}
