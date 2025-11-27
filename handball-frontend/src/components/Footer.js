"use client";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black mt-auto py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Footer Text */}
        <p className="text-sm md:text-base font-semibold">
          &copy; {new Date().getFullYear()} Handball 263. All Rights Reserved. | Developed by CodeMafia
        </p>

        {/* Social Icons */}
        <div className="flex space-x-4 text-xl">
          <a href="https://facebook.com/handball263" target="_blank" rel="noreferrer" className="hover:text-orange-700 transition">
            <FaFacebook />
          </a>
          <a href="https://twitter.com/handball263" target="_blank" rel="noreferrer" className="hover:text-orange-700 transition">
            <FaTwitter />
          </a>
          <a href="https://instagram.com/handball263" target="_blank" rel="noreferrer" className="hover:text-orange-700 transition">
            <FaInstagram />
          </a>
          <a href="https://youtube.com/handball263" target="_blank" rel="noreferrer" className="hover:text-orange-700 transition">
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );
}
