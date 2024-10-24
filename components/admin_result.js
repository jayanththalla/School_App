import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AResults = () => {
  const [examTitle, setExamTitle] = useState('');
  const [className, setClassName] = useState('I');
  const [section, setSection] = useState('A');
  const [maxMarks, setMaxMarks] = useState('');
  const [numSubjects, setNumSubjects] = useState(0);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});

  const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const sections = ['A', 'B', 'C', 'D'];

  // Fetch students based on class and section
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`/api/students?class=${className}&section=${section}`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      }
    };

    if (className && section) {
      fetchStudents();
    }
  }, [className, section]);

  // Handle form submissions
  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultsData = students.map((student) => ({
      studentId: student.id,
      examType: examTitle,
      subjects: Array.from({ length: numSubjects }, (_, index) => ({
        subject: `Subject ${index + 1}`, // Replace with actual subject names if needed
        marksObtained: marks[student.id]?.[index] || 0,
        totalMarks: maxMarks,
        grade: calculateGrade(marks[student.id]?.[index] || 0, maxMarks),
        remarks: marks[student.id]?.[index] >= (maxMarks * 0.4) ? 'Passed' : 'Failed',
      })),
    }));

    try {
      await axios.post('/api/results', { results: resultsData });
      alert('Results updated successfully!');
    } catch (error) {
      console.error('Error updating results:', error);
      alert('Failed to update results.');
    }
  };

  // Function to calculate grade based on marks
  const calculateGrade = (marksObtained, totalMarks) => {
    const percentage = (marksObtained / totalMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  // Handle subject marks input
  const handleMarksChange = (studentId, subjectIndex, value) => {
    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentId]: {
        ...prevMarks[studentId],
        [subjectIndex]: value,
      },
    }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Update Student Results</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Exam Title */}
        <div>
          <label className="block text-lg font-medium mb-2">Exam Title</label>
          <input
            type="text"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="border rounded-lg p-2 w-full"
            placeholder="Enter exam title"
            required
          />
        </div>

        {/* Class and Section Selection */}
        <div className="grid grid-cols-2 gap-6">
          {/* Class */}
          <div>
            <label className="block text-lg font-medium mb-2">Class</label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="border rounded-lg p-2 w-full"
            >
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
          
          {/* Section */}
          <div>
            <label className="block text-lg font-medium mb-2">Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="border rounded-lg p-2 w-full"
            >
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Max Marks */}
        <div>
          <label className="block text-lg font-medium mb-2">Max Marks</label>
          <input
            type="number"
            value={maxMarks}
            onChange={(e) => setMaxMarks(e.target.value)}
            className="border rounded-lg p-2 w-full"
            placeholder="Enter max marks"
            required
          />
        </div>

        {/* Number of Subjects */}
        <div>
          <label className="block text-lg font-medium mb-2">Number of Subjects</label>
          <input
            type="number"
            value={numSubjects}
            onChange={(e) => setNumSubjects(Number(e.target.value))}
            className="border rounded-lg p-2 w-full"
            placeholder="Enter number of subjects"
            required
          />
        </div>

        {/* Dynamic Table for Results */}
        {students.length > 0 && numSubjects > 0 && (
          <table className="min-w-full border mt-6">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="border p-2">Student Name</th>
                {[...Array(numSubjects)].map((_, index) => (
                  <th key={index} className="border p-2">Subject {index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="border p-2">{student.name}</td>
                  {[...Array(numSubjects)].map((_, index) => (
                    <td key={index} className="border p-2">
                      <input
                        type="number"
                        placeholder="Marks"
                        value={marks[student.id]?.[index] || ''}
                        onChange={(e) => handleMarksChange(student.id, index, e.target.value)}
                        className="border rounded-lg p-1 w-full"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg w-full mt-4 hover:bg-blue-700"
        >
          Update Results
        </button>
      </form>
    </div>
  );
};

export default AResults;
