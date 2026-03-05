'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Image as ImageIcon, Edit, Trash2 } from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

export default function GalleryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const galleryId = params.id;
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await fetcher(`galleries/${galleryId}`);
        setGallery(data);
      } catch (error) {
        console.error('Error loading gallery:', error);
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, [galleryId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/galleries/${galleryId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        }
      });

      if (response.ok) {
        alert('Gallery item deleted successfully');
        router.push('/admin/galleries');
      } else {
        alert('Failed to delete gallery item');
      }
    } catch (error) {
      console.error('Error deleting gallery:', error);
      alert('Error deleting gallery item');
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
          <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading gallery...</p>
        </motion.div>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Gallery not found</p>
          <Link href="/admin/galleries">
            <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl">
              Back to Galleries
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
          <Link href="/admin/galleries">
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Gallery Details</h1>
            <p className="text-gray-400 mt-1">View gallery item</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href={`/admin/galleries/${galleryId}/edit`}>
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
        {gallery.media_url && (
          <div className="relative h-96">
            {gallery.media_type === 'video' ? (
              <video
                src={gallery.media_url}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={gallery.media_url}
                alt={gallery.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">{gallery.title}</h2>
            <div className="px-4 py-2 rounded-full text-sm font-semibold bg-pink-500/20 text-pink-400">
              {gallery.media_type || 'image'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gallery.tournament && (
              <div className="p-4 bg-gray-700/30 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Tournament</p>
                <p className="text-white font-semibold">{gallery.tournament.name}</p>
              </div>
            )}
            {gallery.team && (
              <div className="p-4 bg-gray-700/30 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Team</p>
                <p className="text-white font-semibold">{gallery.team.name}</p>
              </div>
            )}
            {gallery.news && (
              <div className="p-4 bg-gray-700/30 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">News Article</p>
                <p className="text-white font-semibold">{gallery.news.title}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
