import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaCalendarAlt, FaUser } from "react-icons/fa";

export default function NewsCard({ article }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
    >
      {/* Featured Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center">
            <FaUser className="w-16 h-16 text-white/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        
        {/* Date badge */}
        {article.created_at && (
          <div className="absolute top-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
              <FaCalendarAlt className="w-3 h-3" />
              <span>{formatDate(article.created_at)}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Category */}
        {article.category && (
          <div className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
            {article.category}
          </div>
        )}
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {article.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {article.content || article.excerpt || "Read more to discover the full story..."}
        </p>
        
        {/* Author & Read More */}
        <div className="flex items-center justify-between">
          {article.author && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FaUser className="w-3 h-3" />
              <span>By {article.author}</span>
            </div>
          )}
          
          <Link
            href={`/news/${article.id}`}
            className="inline-flex items-center space-x-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors group"
          >
            <span>Read More</span>
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}