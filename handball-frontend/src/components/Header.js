"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/viewer/home", label: "Home" },
    { href: "/viewer/leagues", label: "Leagues" },
    { href: "/viewer/teams", label: "Teams" },
    { href: "/viewer/players", label: "Players" },
    { href: "/viewer/fixtures", label: "Fixtures" },
    { href: "/viewer/rankings", label: "Rankings" },
    { href: "/viewer/gallery", label: "Gallery" },
    { href: "/viewer/merchandise", label: "Merch" },
  ];

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <header className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/viewer/home" 
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <Image
              src="/img/logo.png"
              alt="Handball 263 Logo"
              width={40}
              height={40}
              className="rounded-lg"
              priority
            />
            <span className="font-bold text-xl tracking-tight">Handball 263</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-white text-orange-600 shadow-md"
                    : "hover:bg-white/30 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button (placeholder for future implementation) */}
          <button className="lg:hidden p-2 rounded-md hover:bg-white/30 transition-colors">
            <div className="w-6 h-0.5 bg-black mb-1.5"></div>
            <div className="w-6 h-0.5 bg-black mb-1.5"></div>
            <div className="w-6 h-0.5 bg-black"></div>
          </button>
        </div>
      </div>
    </header>
  );
}