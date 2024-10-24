import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faClock, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const TTimetable = () => {
  const [classSelected, setClassSelected] = useState('');
  const [sectionSelected, setSectionSelected] = useState('');
  const [sessionCount, setSessionCount] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [customSubjects, setCustomSubjects] = useState({});
  const [message, setMessage] = useState('');

  const subjects = ['Telugu', 'Hindi', 'English', 'Maths', 'Science', 'Social', 'Lunch', 'Break', 'Custom'];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!classSelected || !sectionSelected) {
      setMessage('Please select both class and section.');
      return;
    }

    const timetableData = [];

    sessions.forEach((session) => {
      days.forEach((day) => {
        const subject = session[day];
        if (subject && session.startTime && session.endTime) {
          timetableData.push({
            class: classSelected,
            section: sectionSelected,
            day: day.charAt(0).toUpperCase() + day.slice(1),
            subject: subject === 'Custom' ? customSubjects[`${sessions.indexOf(session)}-${day}`] : subject,
            time: `${session.startTime} - ${session.endTime}`,
          });
        }
      });
    });

    if (timetableData.length === 0) {
      setMessage("Please fill in the timetable data.");
      return;
    }

    try {
      const response = await fetch('/api/timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timetableData),
      });

      if (response.ok) {
        setMessage('Timetable submitted successfully!');
      } else {
        setMessage('Failed to submit timetable.');
      }
    } catch (error) {
      console.error('Error submitting timetable:', error);
      setMessage('Error submitting timetable. Please try again.');
    }
  };

  const handleSessionCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setSessionCount(count);
    setSessions(
      Array.from({ length: count }, () => ({
        startTime: '',
        endTime: '',
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
      }))
    );
  };

  const handleSessionChange = (index, day, value) => {
    setSessions((prevSessions) => {
      const updatedSessions = [...prevSessions];
      updatedSessions[index][day] = value;

      if (value === 'Lunch' || value === 'Break') {
        days.forEach((d) => {
          updatedSessions[index][d] = value;
        });
      }

      return updatedSessions;
    });
  };

  const handleCustomSubjectChange = (index, day, value) => {
    setCustomSubjects((prev) => ({
      ...prev,
      [`${index}-${day}`]: value,
    }));

    setSessions((prevSessions) => {
      const updatedSessions = [...prevSessions];
      updatedSessions[index][day] = 'Custom';
      return updatedSessions;
    });
  };

  const handleResetCustomSubject = (index, day) => {
    setCustomSubjects((prev) => {
      const updatedCustomSubjects = { ...prev };
      delete updatedCustomSubjects[`${index}-${day}`];
      return updatedCustomSubjects;
    });

    setSessions((prevSessions) => {
      const updatedSessions = [...prevSessions];
      updatedSessions[index][day] = '';
      return updatedSessions;
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-xl rounded-lg max-w-6xl">
      <h2 className="text-3xl font-bold text-center text-indigo-800 mb-8">Timetable Creator</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-indigo-700 font-semibold mb-2" htmlFor="class">Class:</label>
            <select
              id="class"
              value={classSelected}
              onChange={(e) => setClassSelected(e.target.value)}
              className="w-full p-3 border border-indigo-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Class</option>
              {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'].map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-indigo-700 font-semibold mb-2" htmlFor="section">Section:</label>
            <select
              id="section"
              value={sectionSelected}
              onChange={(e) => setSectionSelected(e.target.value)}
              className="w-full p-3 border border-indigo-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Section</option>
              {['A', 'B', 'C', 'D'].map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-indigo-700 font-semibold mb-2" htmlFor="sessions">
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            Number of Sessions:
          </label>
          <input
            type="number"
            id="sessions"
            value={sessionCount}
            onChange={handleSessionCountChange}
            min="1"
            max="10"
            className="w-full p-3 border border-indigo-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {sessionCount > 0 && (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Time</th>
                  {days.map((day) => (
                    <th key={day} className="px-4 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-indigo-200">
                {sessions.map((session, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col sm:flex-row sm:space-x-2">
                        <input
                          type="time"
                          value={session.startTime}
                          onChange={(e) => handleSessionChange(index, 'startTime', e.target.value)}
                          className="border border-indigo-300 rounded-md p-1 mb-1 sm:mb-0"
                        />
                        <input
                          type="time"
                          value={session.endTime}
                          onChange={(e) => handleSessionChange(index, 'endTime', e.target.value)}
                          className="border border-indigo-300 rounded-md p-1"
                        />
                      </div>
                    </td>
                    {days.map((day) => (
                      <td key={day} className="px-4 py-3 whitespace-nowrap">
                        {session[day] === 'Custom' ? (
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={customSubjects[`${index}-${day}`] || ''}
                              onChange={(e) => handleCustomSubjectChange(index, day, e.target.value)}
                              className="border border-indigo-300 rounded-md p-1 w-full"
                              placeholder="Custom subject"
                            />
                            <button
                              type="button"
                              onClick={() => handleResetCustomSubject(index, day)}
                              className="ml-2 p-1 text-indigo-600 hover:text-indigo-900"
                            >
                              <FontAwesomeIcon icon={faSync} />
                            </button>
                          </div>
                        ) : (
                          <select
                            value={session[day] || ''}
                            onChange={(e) => handleSessionChange(index, day, e.target.value)}
                            className="border border-indigo-300 rounded-md p-1 w-full"
                          >
                            <option value="">Select</option>
                            {subjects.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-3 text-center rounded-md ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Submit Timetable
          </button>
        </div>
      </form>
    </div>
  );
};

export default TTimetable;