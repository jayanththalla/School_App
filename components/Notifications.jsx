import React, { useState, useEffect } from 'react';
import { FaBell, FaCalendarAlt, FaDollarSign, FaExclamationCircle, FaTable } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
      });

      const result = await response.json();

      if (result.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === id
              ? { ...notification, read: true }
              : notification
          )
        );
      } else {
        console.error('Failed to mark notification as read:', result.message);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'exam':
        return <FaCalendarAlt className="text-blue-500" />;
      case 'fee':
        return <FaDollarSign className="text-green-500" />;
      case 'attendance':
        return <FaExclamationCircle className="text-red-500" />;
      case 'timetable':
        return <FaTable className="text-yellow-500" />;
      case 'event':
        return <FaBell className="text-yellow-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Notifications</h2>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg shadow flex items-center justify-between hover:bg-blue-100 cursor-pointer transition-transform transform hover:scale-105 ${
                notification.read ? 'bg-gray-100' : 'bg-blue-50'
              }`}
            >
              <div className="flex items-center space-x-4 ">
                <div className="text-2xl">
                  {getIcon(notification.type)}
                </div>

                <div>
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-gray-500 text-sm">{new Date(notification.date).toLocaleDateString()}</p>
                </div>
              </div>

              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification._id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
