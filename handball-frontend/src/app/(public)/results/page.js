"use client";

import { motion } from "framer-motion";
import { Trophy, Calendar, Filter } from "lucide-react";
import { useState } from "react";

export default function ResultsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = [
    { id: "all", name: "All Results" },
    { id: "today", name: "Today" },
    { id: "week", name: "This Week" },
    { id: "month", name: "This Month" },
  ];

  const results = [
    {
      id: 1,
      date: "2026-03-05",
      time: "18:00",
      league: "Premier League",
      homeTeam: "Harare Hawks",
      awayTeam: "Bulawayo Bulls",
      homeScore: 28,
      awayScore: 24,
      status: "Final"
    },
    {
      id: 2,
      date: "2026-03-04",
      time: "16:30",
      league: "Premier League",
      homeTeam: "Mutare Mavericks",
      awayTeam: "Gweru Giants",
      homeScore: 31,
      awayScore: 29,
      status: "Final"
    },
    {
      id: 3,
      date: "2026-03-03",
      time: "19:00",
      league: "Division One",
      homeTeam: "Chitungwiza Cheetahs",
      awayTeam: "Masvingo Mustangs",
      homeScore: 22,
      awayScore: 26,
      status: "Final"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Match Results
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Complete archive of all handball match results and scores
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    selectedFilter === filter.id
                      ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">{result.date}</p>
                      <p className="text-xs text-gray-500">{result.time}</p>
                    </div>
                    <div className="h-12 w-px bg-gray-200"></div>
                    <div>
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-2">
                        {result.league}
                      </span>
                      <p className="text-xs text-gray-500">{result.status}</p>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-3 gap-4 items-center">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{result.homeTeam}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-4">
                        <span className="text-3xl font-bold text-gray-900">
                          {result.homeScore}
                        </span>
                        <span className="text-2xl text-gray-400">-</span>
                        <span className="text-3xl font-bold text-gray-900">
                          {result.awayScore}
                        </span>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">{result.awayTeam}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
