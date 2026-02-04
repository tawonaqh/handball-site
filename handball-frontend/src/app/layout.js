import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Handball 263 - Zimbabwe's Premier Handball Hub",
  description: "Experience the ultimate handball destination with live tournaments, comprehensive rankings, detailed player statistics, and breaking news from across Zimbabwe.",
  keywords: "handball, zimbabwe, sports, tournaments, rankings, players, teams, news",
  authors: [{ name: "Handball 263" }],
  creator: "Handball 263",
  publisher: "Handball 263",
  openGraph: {
    title: "Handball 263 - Zimbabwe's Premier Handball Hub",
    description: "Experience the ultimate handball destination with live tournaments, comprehensive rankings, detailed player statistics, and breaking news from across Zimbabwe.",
    url: "https://handball263.com",
    siteName: "Handball 263",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Handball 263 - Zimbabwe's Premier Handball Hub",
    description: "Experience the ultimate handball destination with live tournaments, comprehensive rankings, detailed player statistics, and breaking news from across Zimbabwe.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
