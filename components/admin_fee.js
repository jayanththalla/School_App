import React, { useState, useEffect } from 'react';

const AUpdateFees = () => {
  const [className, setClassName] = useState('I');
  const [section, setSection] = useState('A');
  const [students, setStudents] = useState([]);
  const [feeStatus, setFeeStatus] = useState({});
  const [loading, setLoading] = useState(false);

  const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const sections = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    const fetchStudentsAndFees = async () => {
      setLoading(true);
      try {
        const studentRes = await fetch(`/api/students?className=${className}&section=${section}`);
        const feeRes = await fetch('/api/fees');
        const studentData = await studentRes.json();
        const feeData = await feeRes.json();

        setStudents(studentData.data || []);

        const fees = feeData.data.reduce((acc, fee) => {
          acc[fee.studentId] = {
            term1: fee.term1 || 'not paid',
            term2: fee.term2 || 'not paid',
            term3: fee.term3 || 'not paid',
            term4: fee.term4 || 'not paid',
          };
          return acc;
        }, {});
        setFeeStatus(fees);
      } catch (error) {
        console.error('Error fetching students or fees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndFees();
  }, [className, section]);

  const handleRadioChange = (studentId, term, value) => {
    setFeeStatus((prevState) => ({
      ...prevState,
      [studentId]: { ...prevState[studentId], [term]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const studentId in feeStatus) {
      const termUpdates = feeStatus[studentId];

      await fetch('/api/fees', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, termUpdates }),
      });
    }

    alert('Fee details updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Fee Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <label className="mr-4 font-semibold">Class:</label>
          <select value={className} onChange={(e) => setClassName(e.target.value)} className="border rounded-lg p-2">
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label className="mr-4 font-semibold">Section:</label>
          <select value={section} onChange={(e) => setSection(e.target.value)} className="border rounded-lg p-2">
            {sections.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading students...</p>
        ) : students.length > 0 ? (
          <table className="min-w-full border border-gray-300 mt-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Student Name</th>
                <th className="border border-gray-300 p-2">Term 1</th>
                <th className="border border-gray-300 p-2">Term 2</th>
                <th className="border border-gray-300 p-2">Term 3</th>
                <th className="border border-gray-300 p-2">Term 4</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{student.name}</td>
                  {['term1', 'term2', 'term3', 'term4'].map((term) => (
                    <td key={term} className="border border-gray-300 p-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="paid"
                          checked={feeStatus[student._id]?.[term] === 'paid'}
                          onChange={() => handleRadioChange(student._id, term, 'paid')}
                          className="mr-1"
                        />
                        Paid
                      </label>
                      <label className="flex items-center ml-2">
                        <input
                          type="radio"
                          value="not paid"
                          checked={feeStatus[student._id]?.[term] === 'not paid'}
                          onChange={() => handleRadioChange(student._id, term, 'not paid')}
                          className="mr-1"
                        />
                        Not Paid
                      </label>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students found.</p>
        )}

        <button
          type="submit"
          className="mt-4 p-3 bg-blue-600 text-white rounded-lg w-full hover:bg-blue-700 transition duration-200"
        >
          Update Fee Details
        </button>
      </form>
    </div>
  );
};

export default AUpdateFees;
