import { useEffect, useState } from 'react';
import { BookOpenIcon, CalculatorIcon, BeakerIcon, GlobeAltIcon, ColorSwatchIcon, AcademicCapIcon } from '@heroicons/react/solid';
import { Dumbbell, FlaskConical, Activity } from 'lucide-react';

const Timetable = () => {
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    fetch('/api/timetable')
      .then(response => response.json())
      .then(data => setTimetable(data))
      .catch(error => console.error('Error fetching timetable:', error));
  }, []);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const times = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'];

  const groupedByDay = timetable.reduce((acc, curr) => {
    if (!acc[curr.day]) {
      acc[curr.day] = [];
    }
    acc[curr.day].push(curr);
    return acc;
  }, {});

  const subjectIcons = {
    'Math': <CalculatorIcon className="h-6 w-6 text-blue-600" />,
    'English': <BookOpenIcon className="h-6 w-6 text-green-600" />,
    'History': <AcademicCapIcon className="h-6 w-6 text-purple-600" />,
    'Biology': <FlaskConical className="h-6 w-6 text-pink-600" />,
    'Physical Education': <Dumbbell className="h-6 w-6 text-red-600" />,
    'Chemistry': <BeakerIcon className="h-6 w-6 text-yellow-600" />,
    'Geography': <GlobeAltIcon className="h-6 w-6 text-teal-600" />,
    'Art': <ColorSwatchIcon className="h-6 w-6 text-orange-600" />,
    'Games': <Activity className="h-6 w-6 text-green-600" />,
    'Lunch': <ColorSwatchIcon className="h-6 w-6 text-gray-600" />,
    'Break': <ColorSwatchIcon className="h-6 w-6 text-gray-400" />,
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Weekly Timetable</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 border-b text-lg">Time</th>
              {daysOfWeek.map(day => (
                <th key={day} className="px-4 py-2 border-b text-lg">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time, index) => (
              <tr key={time} className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="px-4 py-2 font-bold border-r bg-blue-100 text-blue-800">{time}</td>
                {daysOfWeek.map(day => (
                  <td key={day} className="px-4 py-2 border-r text-center">
                    <div
                      className={`flex items-center justify-center space-x-2 p-2 rounded-md ${groupedByDay[day] && groupedByDay[day].find(t => t.time === time)
                        ? 'bg-blue-50 text-blue-800 shadow-md'
                        : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {groupedByDay[day] && groupedByDay[day].find(t => t.time === time) ? (
                        <>
                          {subjectIcons[groupedByDay[day].find(t => t.time === time).subject]}
                          <span className="font-semibold">{groupedByDay[day].find(t => t.time === time).subject}</span>
                        </>
                      ) : (
                        '-'
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
