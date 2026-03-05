"use client";

import { motion } from "framer-motion";
import { FileText, Download, Calendar, Tag } from "lucide-react";
import { useState } from "react";

export default function PressPage() {
  const [selectedYear, setSelectedYear] = useState("2026");

  const years = ["2026", "2025", "2024"];

  const pressReleases = [
    {
      id: 1,
      title: "Handball 263 Announces New Championship Season",
      date: "2026-03-01",
      category: "Championship",
      excerpt: "The Zimbabwe Handball Association is excited to announce the start of the 2026 championship season with expanded teams and new venues.",
      downloadUrl: "#"
    },
    {
      id: 2,
      title: "Record Breaking Attendance at National Finals",
      date: "2026-02-15",
      category: "Events",
      excerpt: "Over 5,000 fans attended the national finals, marking the highest attendance in Zimbabwe handball history.",
      downloadUrl: "#"
    },
    {
      id: 3,
      title: "Youth Development Program Launch",
      date: "2026-01-20",
      category: "Development",
      excerpt: "New grassroots initiative aims to introduce handball to 10,000 young athletes across Zimbabwe.",
      downloadUrl: "#"
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
            <FileText className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Press Releases
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Official announcements and media resources from Handball 263
            </p>
          </motion.div>
        </div>
      </section>

      {/* Year Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedYear === year
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {pressReleases.map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        <Tag className="w-3 h-3" />
                        {release.category}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {release.date}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {release.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {release.excerpt}
                    </p>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:shadow-lg transition-shadow whitespace-nowrap">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8"
            >
              <FileText className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Media Inquiries
              </h2>
              <p className="text-gray-600 mb-6">
                For press inquiries, interview requests, or media credentials, please contact our communications team.
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> press@handball263.co.zw</p>
                <p><strong>Phone:</strong> +263 XX XXX XXXX</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
