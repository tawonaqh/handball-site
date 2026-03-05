'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Edit, Trash2, Calendar, ExternalLink } from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

export default function AdDetailPage() {
  const params = useParams();
  const router = useRouter();
  const adId = params.id;
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAd() {
      try {
        const data = await fetcher(`ads/${adId}`);
        setAd(data);
      } catch (error) {
        console.error('Error loading ad:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAd();
  }, [adId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ads/${adId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        }
      });

      if (response.ok) {
        alert('Ad deleted successfully');
        router.push('/admin/ads');
      } else {
        alert('Failed to delete ad');
      }
    } catch (error) {
      console.error('Error deleting ad:', error);
      alert('Error deleting ad');
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
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading ad...</p>
        </motion.div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Ad not found</p>
          <Link href="/admin/ads">
            <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl">
              Back to Ads
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
          <Link href="/admin/ads">
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Advertisement Details</h1>
            <p className="text-gray-400 mt-1">View ad information</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href={`/admin/ads/${adId}/edit`}>
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
        {ad.image_url && (
          <div className="relative h-96">
            <img
              src={ad.image_url}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">{ad.title}</h2>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              ad.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {ad.active ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Start Date</p>
                <p className="text-white font-semibold">
                  {ad.start_date ? new Date(ad.start_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">End Date</p>
                <p className="text-white font-semibold">
                  {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {ad.link && (
            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">Target URL</p>
                <a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 break-all">
                  {ad.link}
                </a>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
