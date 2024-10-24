import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  CalendarIcon,
  CreditCardIcon,
  UserIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ClipboardListIcon,
  BellIcon
} from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link'; // Add import for Next.js Link

const DashboardCard = ({ href, icon: Icon, title, description, className }) => (
  <Link href={href} passHref>
    <motion.div
      className={`bg-white shadow-lg rounded-lg p-4 flex items-center space-x-4 transition duration-300 ease-in-out ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="h-8 w-8" />
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </motion.div>
  </Link>
);


const TeacherDashboard = () => {
  const [data, setData] = useState({
    user: { name: 'Teacher' },
    notifications: [
      { _id: '1', message: 'New assignment added!', date: '2024-08-08' },
      { _id: '2', message: 'Student attendance updated.', date: '2024-09-09' },
      { _id: '3', message: 'Mock test results are available.', date: '2024-01-01' },
    ],
    attendance: [],
    assignments: [],
    mockTests: [],
    timetable: [],
    classDiary: [],
    exams: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading
    setIsLoading(false);
  }, []);

  const { user, notifications } = data;
  const userName = user?.name || 'Teacher';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500 border-opacity-50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-lg">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col h-64 overflow-y-auto">
              <h2 className="text-xl font-bold mb-2 flex items-center">
                <BellIcon className="h-6 w-6 mr-2 text-blue-600" />
                Notifications
              </h2>
              <AnimatePresence>
                {notifications.length > 0 ? (
                  <ul className="space-y-2">
                    {notifications.map((notification) => (
                      <motion.li
                        key={notification._id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-3 rounded-md text-sm text-gray-800 bg-blue-50 shadow-lg hover:bg-blue-100 transition duration-300 ease-in-out"
                      >
                        <div className="flex items-center">
                          <p className="font-medium">{notification.message}</p>
                          <p className="text-gray-500 text-xs ml-auto">
                            {new Date(notification.date).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 text-sm text-center mt-4"
                  >
                    No new notifications
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-center items-center">
              <motion.div
                className="relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/assets/image.png"
                  alt="Profile"
                  width={250}
                  height={250}
                  className="rounded-full object-cover shadow-lg border-4 border-gray-300"
                />
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              href="/tattendance"
              icon={UserIcon}
              title="Attendance"
              description="Manage student attendance"
              className="text-blue-500"
            />
            <DashboardCard
              href="/tassignments" // This is the link to the assignments page
              icon={ClipboardListIcon}
              title="Assignments"
              description="Upload and manage assignments"
              className="text-red-500"
            />

            <DashboardCard
              href="/tmocktests"
              icon={LightBulbIcon}
              title="Mock Tests"
              description="Create and upload mock tests"
              className="text-green-500"
            />
            <DashboardCard
              href="/ttimetable"
              icon={CalendarIcon}
              title="Timetable Management"
              description="Update class timetable"
              className="text-yellow-500"
            />
            <DashboardCard
              href="/tclassdiary"
              icon={DocumentTextIcon}
              title="Class Diary"
              description="Document daily class activities"
              className="text-purple-500"
            />
            <DashboardCard
              href="/exams"
              icon={DocumentTextIcon}
              title="Exams"
              description="Manage exam schedules"
              className="text-pink-500"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
