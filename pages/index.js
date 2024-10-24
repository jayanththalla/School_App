import React from 'react';
import { motion } from 'framer-motion';
import { FiLogIn, FiUserPlus, FiBook, FiCalendar, FiMessageCircle } from 'react-icons/fi';
import Link from 'next/link';  // Import Link from Next.js for navigation

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-xl shadow-lg"
  >
    <Icon className="text-4xl text-indigo-600 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10">
        <header className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
          <nav className="container mx-auto px-6 py-3">
            <div className="flex justify-between items-center">
              <div className="text-white font-bold text-xl">EduConnect</div>
              <div className="hidden md:flex space-x-4">
                <a href="#" className="text-white hover:text-indigo-200">About</a>
                <a href="#" className="text-white hover:text-indigo-200">Features</a>
                <a href="#" className="text-white hover:text-indigo-200">Contact</a>
              </div>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
              Welcome to EduConnect
            </h1>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Empowering education through innovation. Connect, learn, and grow with our cutting-edge platform designed for students, teachers, and parents.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-full shadow-lg flex items-center justify-center"
                >
                  <FiLogIn className="mr-2" />
                  Login
                </motion.button>
              </Link>
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg flex items-center justify-center"
                >
                  <FiUserPlus className="mr-2" />
                  Sign Up
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
          >
            <FeatureCard 
              icon={FiBook}
              title="Interactive Learning"
              description="Engage with dynamic course materials and collaborative tools."
            />
            <FeatureCard 
              icon={FiCalendar}
              title="Smart Scheduling"
              description="Efficiently manage classes, assignments, and extracurricular activities."
            />
            <FeatureCard 
              icon={FiMessageCircle}
              title="Community Connect"
              description="Foster communication between students, teachers, and parents."
            />
          </motion.div>
        </main>

        <footer className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg text-white py-8">
          <div className="container mx-auto px-6 text-center">
            <p>&copy; 2024 EduConnect. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
