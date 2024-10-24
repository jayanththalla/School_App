import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CreateAssignmentForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    description: '',
    marks: '',
    dueDate: '',
    class: '',
    section: '',
  });
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [previousAssignments, setPreviousAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionsData, setSubmissionsData] = useState([]); // Track student submissions

  // Fetch assignments from the database
  const fetchAssignments = async () => {
    try {
      const res = await axios.get('/api/assignments');
      setPreviousAssignments(res.data);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    }
  };

  // Fetch submissions data for performance tracking
  const fetchSubmissions = async () => {
    try {
      const res = await axios.get('/api/submissions');
      setSubmissionsData(res.data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (selectedAssignment) {
        // Update assignment
        res = await axios.put(`/api/assignments/${selectedAssignment._id}`, formData);
      } else {
        // Create new assignment
        res = await axios.post('/api/assignments', formData);
      }

      if (res.data.success) {
        setNotification({
          type: 'success',
          message: `Assignment ${selectedAssignment ? 'updated' : 'created'} successfully!`,
        });
        fetchAssignments(); // Refresh the list after create/update
        setSelectedAssignment(null); // Clear selection after update
        setFormData({
          subject: '',
          title: '',
          description: '',
          marks: '',
          dueDate: '',
          class: '',
          section: '',
        });

        // Redirect to main assignments page after success
        router.push('/tassignments');
      } else {
        setNotification({ type: 'error', message: 'Failed to create or update assignment' });
      }
    } catch (error) {
      console.error('Failed to create or update assignment:', error);
      setNotification({ type: 'error', message: 'Failed to create or update assignment' });
    }
  };

  // Handle deleting an assignment
  const deleteAssignment = async (assignmentId) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      try {
        const res = await axios.delete(`/api/assignments/${assignmentId}`);
        if (res.data.success) {
          setNotification({ type: 'success', message: 'Assignment deleted successfully!' });
          fetchAssignments(); // Refresh the list after deletion
        } else {
          setNotification({ type: 'error', message: 'Failed to delete assignment' });
        }
      } catch (error) {
        console.error('Failed to delete assignment:', error);
        setNotification({ type: 'error', message: 'Failed to delete assignment' });
      }
    }
  };

  // Set selected assignment for editing
  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      subject: assignment.subject,
      title: assignment.title,
      description: assignment.description,
      marks: assignment.marks,
      dueDate: assignment.dueDate,
      class: assignment.class,
      section: assignment.section,
    });
  };

  // Calculate submission progress based on submissionsData
  const getSubmissionProgress = (assignmentId) => {
    const totalStudents = 30; // For example purposes, assume total students is 30
    const assignmentSubmissions = submissionsData.filter(sub => sub.assignmentId === assignmentId);
    const submittedCount = assignmentSubmissions.length;
    const submissionRate = (submittedCount / totalStudents) * 100;
    return {
      submittedCount,
      totalStudents,
      submissionRate,
    };
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">{selectedAssignment ? 'Edit Assignment' : 'Create New Assignment'}</h2>

      {notification.message && (
        <div className={`mb-6 p-4 rounded-lg ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="mb-4">
          <label className="block text-gray-700">Class</label>
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Class</option>
            {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'].map((romanClass) => (
              <option key={romanClass} value={romanClass}>{romanClass}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Section</label>
          <input
            type="text"
            name="section"
            value={formData.section}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Marks</label>
          <input
            type="number"
            name="marks"
            value={formData.marks}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          {selectedAssignment ? 'Update Assignment' : 'Create Assignment'}
        </button>
      </form>

      {/* List of previous assignments */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Previous Assignments & Submission Progress</h3>
        <ul className="bg-white p-4 rounded-lg shadow-md">
          {previousAssignments.map((assignment) => {
            const { submittedCount, totalStudents, submissionRate } = getSubmissionProgress(assignment._id);

            return (
              <li key={assignment._id} className="mb-6 border-b pb-4">
                <div>
                  <strong>{assignment.title}</strong> - {assignment.subject} ({assignment.class} {assignment.section})
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm text-gray-500">
                    <p>Submissions: {submittedCount} / {totalStudents} ({Math.round(submissionRate)}%)</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/assignments/${assignment._id}`} passHref>
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleEdit(assignment)}
                      >
                        Edit
                      </button>
                    </Link>

                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => deleteAssignment(assignment._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CreateAssignmentForm;
