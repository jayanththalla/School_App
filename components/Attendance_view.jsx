// /components/SAttendance.jsx
import React, { useEffect, useState } from 'react';

const SAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [studentId, setStudentId] = useState('');

  const fetchAttendance = async () => {
    if (studentId) {
      try {
        const response = await fetch(`/api/attendance?studentId=${studentId}&date=${date}`);
        if (!response.ok) {
          throw new Error('Failed to fetch attendance');
        }
        const data = await response.json();
        setAttendanceRecords(data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    }
  };

  // Fetch attendance records when studentId or date changes
  useEffect(() => {
    if (studentId) {
      fetchAttendance(); // Call the fetchAttendance function here too
    }
  }, [studentId, date]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 shadow-md rounded-lg max-w-3xl">
      <h2 className="text-2xl font-semibold text-center text-[#003b6d] mb-6">Student Attendance</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="studentId">Select Student:</label>
        <input
          type="text"
          id="studentId"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Student ID"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button onClick={fetchAttendance} className="bg-[#003b6d] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#255986]">
        View Attendance
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-[#003b6d] mb-2">Attendance Records:</h3>
        <ul>
          {attendanceRecords.length > 0 ? (
            attendanceRecords.map(record => (
              <li key={record._id} className="flex justify-between p-2 border-b border-gray-300">
                <span>{record.date}</span>
                <span className={record.status === 'present' ? 'text-green-500' : record.status === 'absent' ? 'text-red-500' : 'text-gray-500'}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-700">No records found for this student.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SAttendance;
