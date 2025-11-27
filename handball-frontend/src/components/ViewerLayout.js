"use client";

import Header from "./Header";
import Footer from "./Footer";

export default function ViewerLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-yellow-50">
      {/* Header */}
      <Header />

      {/* Main content grows to take available space */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
