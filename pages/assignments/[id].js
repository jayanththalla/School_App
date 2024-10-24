// pages/assignments/[id].js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import CreateAssignmentForm from '../../components/Teacher_assignments';

const AssignmentDetailPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the dynamic ID from the URL
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchAssignment = async () => {
        try {
          const res = await axios.get(`/api/assignments/${id}`);
          setAssignment(res.data);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch assignment:', error);
        }
      };
      fetchAssignment();
    }
  }, [id]);

  // If the assignment is still loading, show a loading state
  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Assignment Details</h2>
      {assignment && (
        <CreateAssignmentForm assignment={assignment} /> // Pass the assignment to the form
      )}
    </div>
  );
};

export default AssignmentDetailPage;
