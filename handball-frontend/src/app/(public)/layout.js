"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { FaArrowUp } from "react-icons/fa";

const pageVariants = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.25, ease: "easeInOut" } },
};

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-2xl shadow-orange-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
          aria-label="Back to top"
        >
          <FaArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function PublicLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-900">
      {/* Header */}
      <Header />

      {/* Main content with page transitions */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Back to Top */}
      <BackToTop />

      {/* Footer */}
      <Footer />
    </div>
  );
}