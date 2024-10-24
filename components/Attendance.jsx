// /components/Attendance.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Attendance = () => {
  const router = useRouter();
  const { studentId } = router.query; // Get studentId from query parameters
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    if (studentId) {
      const fetchAttendanceData = async () => {
        try {
          const response = await fetch(`/api/attendance?studentId=${studentId}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          
          const formattedData = data.reduce((acc, { date, status }) => {
            const formattedDate = new Date(date).toISOString().split('T')[0]; // Convert date to ISO format
            acc[formattedDate] = status;
            return acc;
          }, {});

          setAttendanceData(formattedData);;
        } catch (error) {
          console.error('Error fetching attendance data:', error);
        }
      };

      fetchAttendanceData();
    }
  }, [studentId, selectedMonth, selectedYear]);

  const getDaysInMonth = (year, month) => {
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const getAttendanceStatus = (date) => {
    const status = attendanceData[date];
    switch (status) {
      case 'present':
        return 'bg-green-200 text-green-800';
      case 'absent':
        return 'bg-red-200 text-red-800';
      case 'publicHoliday':
        return 'bg-gray-200 text-gray-800';
      case 'notTracked':
        return 'bg-white text-gray-700';
      default:
        return 'bg-white text-gray-700';
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Attendance</h2>
      
      <div className="flex space-x-4 mb-6">
        <div className="flex flex-col items-center">
          <label className="font-semibold text-gray-600 mb-1">Select Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-center">
          <label className="font-semibold text-gray-600 mb-1">Select Year</label>
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="flex flex-col items-center mb-4 lg:mb-6">
        <div className="text-lg font-semibold text-gray-800 mb-2">
          {months[selectedMonth]} {selectedYear}
        </div>

        <div className="grid grid-cols-7 gap-1 w-72">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-500">
              {day}
            </div>
          ))}

          {getDaysInMonth(selectedYear, selectedMonth).map((date, index) => {
            const dateKey = date.toISOString().split('T')[0];
            const statusClass = getAttendanceStatus(dateKey);
            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-transform
                  ${statusClass}
                  hover:scale-105`}
              >
                <span className="text-base">{date.getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex space-x-2 mb-2 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-200 mr-1"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-200 mr-1"></div>
          <span>Absent</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-200 mr-1"></div>
          <span>Public Holiday</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-white border border-gray-300 mr-1"></div>
          <span>Not Tracked</span>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
