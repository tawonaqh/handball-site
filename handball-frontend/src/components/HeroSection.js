import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image"; // legacy image works with fill
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function HeroSection() {
  const slides = [
    "/img/hero1.jpg",
    "/img/hero2.jpg",
    "/img/hero3.jpg",
  ];

  return (
    <section className="relative h-80 md:h-120 flex items-center justify-center text-center text-black overflow-hidden">
      
      {/* BACKGROUND CAROUSEL */}
      <div className="absolute inset-0 w-full h-full">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-full h-full"
        >
          {slides.map((src, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full">
                <Image
                  src={src}
                  alt={`Slide ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/60 to-orange-500/60"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* OVERLAY CONTENT */}
      <div className="relative z-10 max-w-3xl px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
          Welcome to Handball 263
        </h1>
        <p className="mb-6 text-lg md:text-xl">
          Stay updated with tournaments, rankings & news.
        </p>
        <div className="space-x-4">
          <Link
            href="/viewer/leagues"
            className="px-4 py-2 bg-white text-orange-500 rounded-lg shadow hover:bg-gray-100 transition duration-200"
          >
            View Tournaments
          </Link>
          <Link
            href="/viewer/rankings"
            className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow hover:bg-yellow-400 transition duration-200"
          >
            See Rankings
          </Link>
        </div>
      </div>
    </section>
  );
}
