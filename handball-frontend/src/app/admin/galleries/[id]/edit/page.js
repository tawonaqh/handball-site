'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Save, ArrowLeft, Trophy, Users, FileText } from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';
import ImageUpload from '@/components/ui/ImageUpload';

export default function EditGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const galleryId = params.id;
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    media_url: "",
    media_type: "image",
    tournament_id: "",
    team_id: "",
    news_id: ""
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [galleryData, tournamentsData, teamsData, newsData] = await Promise.all([
          fetcher(`galleries/${galleryId}`),
          fetcher('tournaments'),
          fetcher('teams'),
          fetcher('news')
        ]);
        
        setFormData({
          title: galleryData.title || "",
          media_url: galleryData.media_url || "",
          media_type: galleryData.media_type || "image",
          tournament_id: galleryData.tournament_id || "",
          team_id: galleryData.team_id || "",
          news_id: galleryData.news_id || ""
        });
        setTournaments(tournamentsData || []);
        setTeams(teamsData || []);
        setNews(newsData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load gallery data');
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, [galleryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/galleries/${galleryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Gallery updated successfully!');
        router.push(`/admin/galleries/${galleryId}`);
      } else {
        alert('Failed to update gallery');
      }
    } catch (error) {
      console.error('Error updating gallery:', error);
      alert('Error updating gallery');
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
          <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading gallery data...</p>
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
          <Link href={`/admin/galleries/${galleryId}`}>
            <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ImageIcon className="w-8 h-8 text-pink-500" />
              <span>Edit Gallery</span>
            </h1>
            <p className="text-gray-400 mt-1">Update gallery item</p>
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
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter media title"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Media Type *
          </label>
          <select
            name="media_type"
            value={formData.media_type}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <ImageUpload
          label="Media URL *"
          value={formData.media_url}
          onChange={(url) => setFormData(prev => ({ ...prev, media_url: url }))}
          folder="galleries"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Trophy className="w-4 h-4 inline mr-1" />
              Tournament
            </label>
            <select
              name="tournament_id"
              value={formData.tournament_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            >
              <option value="">Select tournament</option>
              {tournaments.map(tournament => (
                <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Team
            </label>
            <select
              name="team_id"
              value={formData.team_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            >
              <option value="">Select team</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              News Article
            </label>
            <select
              name="news_id"
              value={formData.news_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            >
              <option value="">Select news</option>
              {news.map(item => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Updating...' : 'Update Gallery'}
          </button>
          <Link href={`/admin/galleries/${galleryId}`} className="flex-1">
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
