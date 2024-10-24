import React, { useEffect, useState } from 'react';
import { CalendarIcon, DocumentTextIcon, ClipboardListIcon } from '@heroicons/react/outline';
import { Spinner } from 'react-bootstrap'; // Ensure you have react-bootstrap installed

const getIconForExamType = (examType) => {
  switch (examType.toLowerCase()) {
    case 'math':
      return <DocumentTextIcon className="h-8 w-8 text-yellow-500" />;
    case 'science':
      return <CalendarIcon className="h-8 w-8 text-green-500" />;
    case 'english':
      return <ClipboardListIcon className="h-8 w-8 text-red-500" />;
    default:
      return <CalendarIcon className="h-8 w-8 text-blue-600" />;
  }
};

const ExamDashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch('/api/exam');
        const data = await res.json();
        if (data.success) {
          setSchedules(data.data);
        } else {
          setError('Failed to fetch schedules.');
        }
      } catch (error) {
        setError('Error fetching schedules.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-600">
        <Spinner animation="border" variant="primary" />
        <span className="ml-4">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-red-600">
        <span>{error}</span>
      </div>
    );
  }

  if (!schedules.length) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-600">
        No exam schedules available at the moment.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-poppins">
      <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-8 text-center">Exam Dashboard</h2>
      
      <div className="space-y-8">
        {schedules.map((schedule) => (
          <div key={schedule.examType} className="bg-white p-6 border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 mr-4">
                {getIconForExamType(schedule.examType)}
              </div>
              <h3 className="text-xl font-semibold text-blue-900">
                {schedule.examType.toUpperCase()}
              </h3>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    {schedule.days.map((day, index) => (
                      <th key={index} className="py-3 px-4 border text-left text-sm md:text-base font-medium">
                        {day} - {schedule.dates[index]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {schedule.subjects.map((subject, index) => (
                      <td key={index} className="py-3 px-4 border text-sm md:text-base">
                        {subject}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile-friendly list view */}
            <div className="block md:hidden overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="py-3 px-4 border text-left text-sm font-medium">Day & Date</th>
                    <th className="py-3 px-4 border text-left text-sm font-medium">Subject</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.days.map((day, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 border text-sm">
                        {day} - {schedule.dates[index]}
                      </td>
                      <td className="py-3 px-4 border text-sm">
                        {schedule.subjects[index]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamDashboard;
