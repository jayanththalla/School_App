import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { 
  BookOpenIcon, CalculatorIcon, BeakerIcon, GlobeAltIcon, 
  ColorSwatchIcon, AcademicCapIcon 
} from '@heroicons/react/solid';
import { Dumbbell, FlaskConical, Activity } from 'lucide-react';

// Fetcher function to use with SWR for data fetching
const fetcher = (url) => fetch(url).then((res) => res.json());

const subjectIcons = {
  'Math': <CalculatorIcon className="h-6 w-6 text-blue-600" />,
  'English': <BookOpenIcon className="h-6 w-6 text-green-600" />,
  'History': <AcademicCapIcon className="h-6 w-6 text-purple-600" />,
  'Biology': <FlaskConical className="h-6 w-6 text-pink-600" />,
  'Science': <Dumbbell className="h-6 w-6 text-red-600" />,
  'Chemistry': <BeakerIcon className="h-6 w-6 text-yellow-600" />,
  'Geography': <GlobeAltIcon className="h-6 w-6 text-teal-600" />,
  'Art': <ColorSwatchIcon className="h-6 w-6 text-orange-600" />,
  'Games': <Activity className="h-6 w-6 text-green-600" />,
};

const ClassDiary = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [entries, setEntries] = useState([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year, month) => {
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleDateClick = debounce((date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
  }, 300);

  // Fetch diary entries for the selected date
  const { data, error, isLoading } = useSWR(
    selectedDate ? `/api/diary/${selectedDate}` : null,
    fetcher,
    { shouldRetryOnError: false }
  );

  useEffect(() => {
    if (data && data.success) {
      setEntries(data.data);
    } else {
      setEntries([]);
    }
  }, [data, error]);

  const getDiaryEntries = () => {
    if (error) return 'Failed to load entries.';
    if (!selectedDate) return 'Please select a date.';
    if (isLoading) return 'Loading entries...';

    return entries.length > 0 ? (
      entries.map((entry, idx) => (
        <div key={idx} className="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-md flex items-start space-x-4">
          <div className="flex-shrink-0">
            {subjectIcons[entry.subject] || <ColorSwatchIcon className="h-6 w-6 text-gray-500" />}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-blue-600">{entry.subject}</h4>
            <p className="text-gray-700 text-sm mt-1">{entry.content}</p>
          </div>
        </div>
      ))
    ) : (
      <p>No entries for this date.</p>
    );
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen font-poppins">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Class Diary</h2>

      {/* Month and Year Selectors */}
      <div className="flex space-x-4 mb-8">
        <div className="flex flex-col items-center">
          <label className="font-semibold text-gray-600 mb-1">Select Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
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
            onChange={(e) => {
              const year = parseInt(e.target.value);
              if (year >= 1900 && year <= new Date().getFullYear()) {
                setSelectedYear(year);
              }
            }}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Main Content - Calendar and Diary Entries */}
      <div className="flex flex-col lg:flex-row lg:space-x-8 items-start">
        {/* Calendar View */}
        <div className="flex flex-col items-center mb-6 lg:mb-0">
          <div className="text-lg font-semibold text-gray-800 mb-2">
            {months[selectedMonth]} {selectedYear}
          </div>

          <div className="grid grid-cols-7 gap-2 w-80 md:w-96">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-500">
                {day}
              </div>
            ))}

            {getDaysInMonth(selectedYear, selectedMonth).map((date, index) => {
              const dateKey = date.toISOString().split('T')[0];
              return (
                <div
                  key={index}
                  role="button"
                  aria-label={`Select ${date.toDateString()}`}
                  onClick={() => handleDateClick(date)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-transform
                    ${selectedDate === dateKey ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
                    hover:bg-blue-400 hover:text-white hover:scale-105`}
                >
                  <span className="text-base">{date.getDate()}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Diary Entries Display */}
        <div className="w-full lg:w-96 p-4 bg-white shadow-lg rounded-md">
          <h3 className="text-xl font-semibold text-blue-500 mb-4">Diary Entries</h3>
          {getDiaryEntries()}
        </div>
      </div>
    </div>
  );
};

export default ClassDiary;
