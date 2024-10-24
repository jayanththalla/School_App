"use client"
import React, { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard'; 

const DashboardPage = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = '12345';  // Simulating a user ID
      setUserId(storedUserId);
    };

    fetchUserId();
  }, []);

  return (
    <div>
      {userId ? <Dashboard userId={userId} /> : <p>Loading user info...</p>}
    </div>
  );
};

export default DashboardPage;
