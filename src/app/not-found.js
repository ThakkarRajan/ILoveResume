"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="mb-6">
          <span className="text-7xl md:text-9xl select-none" role="img" aria-label="Lost Astronaut">
            🧑‍🚀
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          404: Page Not Found
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 mb-8">
          Oops! Looks like you took a wrong turn at Albuquerque.<br/>
          This page is as lost as your last pair of matching socks.
        </p>
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-200 text-lg"
          >
            🏠 Take me home!
          </motion.button>
        </Link>
        <div className="mt-8 text-gray-400 text-sm">
          (If you see a tumbleweed, let us know. We keep losing those too.)
        </div>
      </motion.div>
    </div>
  );
} 