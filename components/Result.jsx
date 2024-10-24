import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Dropdown, Spinner } from 'react-bootstrap'; // Ensure you have react-bootstrap installed

const Results = () => {
  const [selectedExam, setSelectedExam] = useState('fa1');
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/results/${selectedExam}`);
        setExamData(response.data);
      } catch (error) {
        setError('Error fetching results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedExam]);

  const examNames = {
    fa1: "Formative Assessment - 1",
    fa2: "Formative Assessment - 2",
    sa1: "Summative Assessment - 1",
    fa3: "Formative Assessment - 3",
    fa4: "Formative Assessment - 4",
    sa2: "Summative Assessment - 2"
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-poppins">
      {/* Exam Selection Dropdown */}
      <div className="mb-6">
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            {examNames[selectedExam]}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {Object.keys(examNames).map((key) => (
              <Dropdown.Item key={key} onClick={() => setSelectedExam(key)}>
                {examNames[key]}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-600">
          <Spinner animation="border" variant="primary" />
          <span className="ml-4">Loading...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-screen text-lg font-semibold text-red-600">
          <span>{error}</span>
        </div>
      )}

      {/* Chart Display */}
      {!loading && !error && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 text-gray-800">
            Performance Overview
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={examData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="subject"
                angle={window.innerWidth < 768 ? -90 : 0}
                textAnchor={window.innerWidth < 768 ? "end" : "middle"}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="marksObtained" fill="#4A90E2" name="Marks Obtained" />
              <Bar dataKey="totalMarks" fill="#D0E1F9" name="Total Marks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Results;
