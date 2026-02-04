"use client";

import Header from "./Header";
import Footer from "./Footer";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ViewerLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col app-bg">
      {/* Header */}
      <Header />

      {/* Main content grows to take available space */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="min-h-screen" // Ensure content takes full height
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
