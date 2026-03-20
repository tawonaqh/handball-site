"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import ImageUpload from "@/components/ui/ImageUpload";

export default function CreateTeamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [leagues, setLeagues] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    gender: "men",
    league_id: "",
    logo_url: ""
  });

  useEffect(() => {
    async function loadLeagues() {
      try {
        const data = await fetcher("leagues");
        setLeagues(data || []);
      } catch (error) {
        console.error("Error loading leagues:", error);
      }
    }
    loadLeagues();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Team created successfully!");
        router.push("/admin/teams");
      } else {
        alert("Failed to create team");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Error creating team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Link href="/admin/teams">
            <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-green-500" />
              <span>Register Team</span>
            </h1>
            <p className="text-gray-400 mt-1">Add a new team to the system</p>
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
            Team Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Harare Hawks"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
        </div>

        <ImageUpload
          label="Team Logo"
          value={formData.logo_url}
          onChange={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
          folder="teams"
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
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              <option value="men">Men's Team</option>
              <option value="women">Women's Team</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              League
            </label>
            <select
              name="league_id"
              value={formData.league_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              <option value="">Select league (optional)</option>
              {leagues.map(league => (
                <option key={league.id} value={league.id}>{league.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? "Creating..." : "Register Team"}
          </button>
          <Link href="/admin/teams" className="flex-1">
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
