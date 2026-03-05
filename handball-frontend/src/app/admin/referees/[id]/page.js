'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Scale, Edit, Trash2, Mail, Phone, Award, BarChart } from 'lucide-react';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

export default function RefereeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const refereeId = params.id;
  const [referee, setReferee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReferee() {
      try {
        const data = await fetcher(`referees/${refereeId}`);
        setReferee(data);
      } catch (error) {
        console.error('Error loading referee:', error);
      } finally {
        setLoading(false);
      }
    }

    loadReferee();
  }, [refereeId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this referee?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/referees/${refereeId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        }
      });

      if (response.ok) {
        alert('Referee deleted successfully');
        router.push('/admin/referees');
      } else {
        alert('Failed to delete referee');
      }
    } catch (error) {
      console.error('Error deleting referee:', error);
      alert('Error deleting referee');
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
          <div className="w-16 h-16 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading referee...</p>
        </motion.div>
      </div>
    );
  }

  if (!referee) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Referee not found</p>
          <Link href="/admin/referees">
            <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl">
              Back to Referees
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'international': return 'bg-yellow-500/20 text-yellow-400';
      case 'national': return 'bg-blue-500/20 text-blue-400';
      case 'regional': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/referees">
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Referee Profile</h1>
            <p className="text-gray-400 mt-1">View referee information</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href={`/admin/referees/${refereeId}/edit`}>
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

      {/* Referee Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden"
      >
        {/* Header with Photo */}
        <div className="relative h-64 bg-gradient-to-br from-teal-500/20 to-teal-600/20">
          {referee.photo_url ? (
            <img
              src={referee.photo_url}
              alt={referee.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Scale className="w-24 h-24 text-teal-500/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold ${getLevelColor(referee.level)}`}>
            {referee.level || 'regional'}
          </div>
          
          <div className="absolute bottom-6 left-6">
            <h2 className="text-3xl font-bold text-white mb-2">{referee.name}</h2>
            <p className="text-xl text-teal-300">Certified Referee</p>
          </div>
        </div>

        {/* Details */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <Mail className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white font-semibold">{referee.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <Phone className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-white font-semibold">{referee.phone || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">License Number</p>
                <p className="text-white font-semibold">{referee.license_number || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <BarChart className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className={`font-semibold ${referee.is_active ? 'text-green-400' : 'text-red-400'}`}>
                  {referee.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          {referee.tournament && (
            <div className="p-4 bg-gray-700/30 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Assigned Tournament</p>
              <p className="text-white font-semibold">{referee.tournament.name}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
