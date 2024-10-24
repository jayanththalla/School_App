import { useState } from 'react';

const subjects = ['Maths', 'Science', 'Social', 'Telugu', 'Hindi', 'English'];

const ExamUpload = () => {
  const [examType, setExamType] = useState('');
  const [numExams, setNumExams] = useState(1);
  const [examData, setExamData] = useState([{ date: '', subject: '', day: '' }]);

  const handleNumExamsChange = (e) => {
    const newNumExams = parseInt(e.target.value);
    setNumExams(newNumExams);
    setExamData(Array.from({ length: newNumExams }, () => ({ date: '', subject: '', day: '' })));
  };

  const handleDateChange = (index, date) => {
    const updatedExamData = [...examData];
    updatedExamData[index].date = date;
    setExamData(updatedExamData);
  };

  const handleSubjectChange = (index, subject) => {
    const updatedExamData = [...examData];
    updatedExamData[index].subject = subject;
    setExamData(updatedExamData);
  };

  const handleDayChange = (index, day) => {
    const updatedExamData = [...examData];
    updatedExamData[index].day = day;
    setExamData(updatedExamData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const scheduleData = {
      examType,
      subjects: examData.map((exam) => exam.subject),
      dates: examData.map((exam) => exam.date),
      days: examData.map((exam) => exam.day),
    };
  
    const response = await fetch('/api/exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scheduleData),
    });
  
    const data = await response.json();
    if (data.success) {
      alert('Schedule uploaded successfully!');
    } else {
      alert('Error uploading schedule');
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload Exam Schedule</h2>

      <div className="mb-4">
        <label className="block mb-1">Exam Type:</label>
        <input
          type="text"
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="border border-gray-300 p-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Number of Exams:</label>
        <input
          type="number"
          value={numExams}
          onChange={handleNumExamsChange}
          min="1"
          className="border border-gray-300 p-2"
        />
      </div>

      <table className="min-w-full border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Day</th>
            <th className="border border-gray-300 p-2">Subject</th>
          </tr>
        </thead>
        <tbody>
          {examData.map((exam, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">
                <input
                  type="date"
                  value={exam.date}
                  onChange={(e) => handleDateChange(index, e.target.value)}
                  className="border border-gray-300 p-1 w-full"
                  required
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  value={exam.day}
                  onChange={(e) => handleDayChange(index, e.target.value)}
                  className="border border-gray-300 p-1 w-full"
                  required
                />
              </td>
              <td className="border border-gray-300 p-2">
                <select
                  value={exam.subject}
                  onChange={(e) => handleSubjectChange(index, e.target.value)}
                  className="border border-gray-300 p-1 w-full"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject, i) => (
                    <option key={i} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Submit Exam Schedule
      </button>
    </form>
  );
};

export default ExamUpload;
