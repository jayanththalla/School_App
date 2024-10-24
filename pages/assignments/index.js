// pages/assignments/index.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get('/api/assignments'); // Fetch all assignments
        setAssignments(res.data);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Assignments</h2>
      <Link href="/tassignments">
        <a className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 mb-4 inline-block">
          Create New Assignment
        </a>
      </Link>
      <ul className="bg-white p-4 rounded-lg shadow-md">
        {assignments.map((assignment) => (
          <li key={assignment._id} className="mb-2 border-b pb-2">
            <div>
              <strong>{assignment.title}</strong> - {assignment.subject}
            </div>
            <div className="flex">
              <Link href={`/assignments/${assignment._id}`}>
                <a className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2">Edit</a>
              </Link>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => deleteAssignment(assignment._id)} // Implement deleteAssignment function
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentsPage;
