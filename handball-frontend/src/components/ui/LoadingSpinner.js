import { motion } from "framer-motion";

export default function LoadingSpinner({ 
  message = "Loading...", 
  size = "default", 
  variant = "default",
  count = 1 
}) {
  const sizeClasses = {
    sm: "w-6 h-6",
    default: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };

  // Skeleton variants for content sections
  if (variant === "skeleton") {
    return (
      <div className="w-full space-y-4 p-6">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-3"
          >
            {/* Skeleton header */}
            <div className="flex items-center space-x-4">
              <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
            {/* Skeleton body lines */}
            <div className="space-y-2 pl-16">
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-5/6" />
              <div className="skeleton h-3 w-2/3" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Card skeleton variant
  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count || 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
          >
            <div className="skeleton h-48 w-full rounded-none" />
            <div className="p-5 space-y-3">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-2/3" />
              <div className="flex justify-between pt-2">
                <div className="skeleton h-8 w-20 rounded-xl" />
                <div className="skeleton h-8 w-20 rounded-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Table row skeleton
  if (variant === "table") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count || 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl border border-gray-100"
          >
            <div className="skeleton w-8 h-8 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-1/3" />
              <div className="skeleton h-3 w-1/4" />
            </div>
            <div className="skeleton h-8 w-20 rounded-lg flex-shrink-0" />
          </motion.div>
        ))}
      </div>
    );
  }

  // Default spinner variant (full page or inline)
  return (
    <div className={`flex items-center justify-center ${variant === "inline" ? "py-12" : "min-h-screen bg-gradient-to-br from-gray-50 to-white"}`}>
      <div className="text-center">
        <motion.div
          className={`${sizeClasses[size]} border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-6 shadow-lg shadow-orange-500/10`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {message}
          </h3>
          <p className="text-gray-500">
            Please wait while we load your content
          </p>
        </motion.div>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1.5 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-orange-500 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}