'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Save, ArrowLeft, Hash, FileText, Activity } from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';
import ImageUpload from '@/components/ui/ImageUpload';

export default function EditPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const playerId = params.id;
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    gender: "men",
    team_id: "",
    position: "",
    jersey_number: "",
    bio: "",
    goals: 0,
    assists: 0,
    matches_played: 0,
    photo_url: ""
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [playerData, teamsData] = await Promise.all([
          fetcher(`players/${playerId}`),
          fetcher('teams')
        ]);
        
        setFormData({
          name: playerData.name || "",
          gender: playerData.gender || "men",
          team_id: playerData.team_id || "",
          position: playerData.position || "",
          jersey_number: playerData.jersey_number || "",
          bio: playerData.bio || "",
          goals: playerData.goals || 0,
          assists: playerData.assists || 0,
          matches_played: playerData.matches_played || 0,
          photo_url: playerData.photo_url || ""
        });
        setTeams(teamsData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load player data');
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, [playerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/players/${playerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Player updated successfully!');
        router.push(`/admin/players/${playerId}`);
      } else {
        alert('Failed to update player');
      }
    } catch (error) {
      console.error('Error updating player:', error);
      alert('Error updating player');
    } finally {
      setLoading(false);
    }
  };

  const positions = [
    "Goalkeeper",
    "Left Wing",
    "Right Wing",
    "Left Back",
    "Right Back",
    "Center Back",
    "Pivot"
  ];

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading player data...</p>
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
          <Link href={`/admin/players/${playerId}`}>
            <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <User className="w-8 h-8 text-purple-500" />
              <span>Edit Player</span>
            </h1>
            <p className="text-gray-400 mt-1">Update player information</p>
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
            Player Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Full name"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <ImageUpload
          label="Player Photo"
          value={formData.photo_url}
          onChange={(url) => setFormData(prev => ({ ...prev, photo_url: url }))}
          folder="players"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team
            </label>
            <select
              name="team_id"
              value={formData.team_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="">Select team</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Position *
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="">Select position</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Hash className="w-4 h-4 inline mr-1" />
              Jersey Number
            </label>
            <input
              type="number"
              name="jersey_number"
              value={formData.jersey_number}
              onChange={handleChange}
              placeholder="e.g., 10"
              min="1"
              max="99"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Biography
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Player biography and achievements..."
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Activity className="w-4 h-4 inline mr-1" />
              Goals
            </label>
            <input
              type="number"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Assists
            </label>
            <input
              type="number"
              name="assists"
              value={formData.assists}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Matches Played
            </label>
            <input
              type="number"
              name="matches_played"
              value={formData.matches_played}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Updating...' : 'Update Player'}
          </button>
          <Link href={`/admin/players/${playerId}`} className="flex-1">
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
