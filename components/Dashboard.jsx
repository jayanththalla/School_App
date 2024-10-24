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
import { 
  FaCalendarAlt, 
  FaDollarSign, 
  FaExclamationCircle, 
  FaTable, 
  FaBell, 
  FaTimes 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardCard = ({ href, icon: Icon, title, description, className }) => (
  <motion.a
    href={href}
    className={`bg-white shadow-lg rounded-lg p-4 flex items-center space-x-4 transition duration-300 ease-in-out ${className}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon className="h-8 w-8" />
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </motion.a>
);

const Dashboard = ({ userId }) => {
  const [data, setData] = useState({
    user: null,
    notifications: [],
    feeDetails: [],
    attendance: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchUnreadNotifications();
  }, []);

  const fetchUnreadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/notifications?read=false');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setData((prevData) => ({
        ...prevData,
        notifications: data.slice(0, 5),
      }));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications. Please try again later.');
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      const result = await response.json();

      if (result.success) {
        // Remove the notification from UI first
        setData((prevData) => ({
          ...prevData,
          notifications: prevData.notifications.filter(
            (notification) => notification._id !== id
          ),
        }));

        // Refetch unread notifications
        fetchUnreadNotifications();
      } else {
        throw new Error(result.message || 'Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError('Failed to mark notification as read. Please try again.');
    }
  };

  const { user, notifications } = data;
  const userName = user?.name || 'Student';

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

  const getIcon = (type) => {
    switch (type) {
      case 'exam':
        return <FaCalendarAlt className="text-blue-500" />;
      case 'fee':
        return <FaDollarSign className="text-green-500" />;
      case 'attendance':
        return <FaExclamationCircle className="text-red-500" />;
      case 'Timetable':
        return <FaTable className="text-yellow-500" />;
      case 'event':
        return <FaBell className="text-yellow-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

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
                        <div className="flex items-center space-x-3">
                          <div className="text-lg">{getIcon(notification.type)}</div>
                          <div className="flex-grow">
                            <p className="font-medium">{notification.message}</p>
                            <p className="text-gray-500 text-xs">
                              {new Date(notification.date).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="text-gray-500 hover:text-red-500 transition duration-300 ease-in-out"
                            aria-label="Mark as read"
                          >
                            <FaTimes />
                          </button>
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
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-700 rounded-full opacity-30"></div>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              href="/timetable"
              icon={CalendarIcon}
              title="Timetable"
              description="View your weekly schedule"
              className="text-blue-500"
            />
            <DashboardCard
              href="/results"
              icon={ClipboardListIcon}
              title="Results"
              description="View your academic results"
              className="text-red-500"
            />
            <DashboardCard
              href="/fee"
              icon={CreditCardIcon}
              title="Fee Details"
              description="Review and manage your fees"
              className="text-green-500"
            />
            <DashboardCard
              href="/attendance"
              icon={UserIcon}
              title="Attendance"
              description="Track your attendance record"
              className="text-yellow-500"
            />
            <DashboardCard
              href="/diary"
              icon={DocumentTextIcon}
              title="Class Diary"
              description="View your class diary entries"
              className="text-purple-500"
            />
            <DashboardCard
              href="/mock_tests"
              icon={LightBulbIcon}
              title="Mock Tests"
              description="Practice with mock tests"
              className="text-orange-500"
            />
            <DashboardCard
              href="/assignments"
              icon={ClipboardListIcon}
              title="Assignments"
              description="Submit and manage assignments"
              className="text-teal-500"
            />
            <DashboardCard
              href="/exams"
              icon={DocumentTextIcon}
              title="Exams"
              description="Check your exam schedule"
              className="text-pink-500"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
