import React, { useState, useCallback, useEffect } from 'react';
import { AlertCircle, Check, FileText, Upload, Loader, Calendar, Clock } from 'lucide-react';
import axios from 'axios';

const Assignments = ({ initialAssignments, currentStudentId, currentUserRole }) => {
  const [assignments, setAssignments] = useState(initialAssignments || []);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingAssignmentId, setUploadingAssignmentId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const studentId = currentStudentId;
  const isStudent = currentUserRole === 'student';

  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/assignments');
        const data = await res.json();
        if (res.ok) {
          setAssignments(data);
        } else {
          setNotification({ type: 'error', message: 'Failed to fetch assignments.' });
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setNotification({ type: 'error', message: 'Error fetching assignments.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleFileChange = useCallback((event, assignmentId) => {
    const file = event.target.files[0];
    const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;

    if (!allowedExtensions.exec(file.name)) {
      setNotification({ type: 'error', message: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.' });
      return;
    }

    setSelectedFile(file);
    setUploadingAssignmentId(assignmentId);
    setUploadProgress(0);
  }, []);

  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) {
      setNotification({ type: 'error', message: 'Please select a file to upload.' });
      return;
    }

    if (!studentId) {
      setNotification({ type: 'error', message: 'Student ID is missing. Please log in again.' });
      return;
    }

    if (!isStudent) {
      setNotification({ type: 'error', message: 'You are not authorized to upload assignments.' });
      return;
    }

    if (!selectedFile) {
      setNotification({ type: 'error', message: 'Please select a file to upload.' });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('assignmentId', uploadingAssignmentId);
    formData.append('studentId', studentId);

    try {
      const response = await axios.put('/api/upload-assignment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const result = response.data;
      if (result.success) {
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment._id === uploadingAssignmentId
              ? { ...assignment, status: 'submitted', file: result.file.name }
              : assignment
          )
        );
        setNotification({ type: 'success', message: 'Assignment submitted successfully!' });
        setUploadProgress(100);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('File upload failed:', error);
      setNotification({ type: 'error', message: `File upload failed: ${error.message}` });
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      setUploadingAssignmentId(null);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [isStudent, selectedFile, uploadingAssignmentId, studentId]);

  const getDueDateStatus = useCallback((dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    return due >= today;
  }, []);

  const renderAssignmentList = useCallback(
    (status) => {
      const filteredAssignments = Array.isArray(assignments)
        ? assignments.filter((assignment) => assignment.status === status)
        : [];
  
      if (filteredAssignments.length === 0) {
        return <p className="text-gray-500 italic">No {status} assignments.</p>;
      }

      return filteredAssignments.map((assignment, index) => (
        <div
          key={assignment._id}
          className="bg-white p-6 rounded-lg shadow-md mb-6 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="font-semibold text-xl text-gray-800 mb-2">
                {assignment.subject}: {assignment.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <p>
                  Due: {new Date(assignment.dueDate).toLocaleDateString('en-GB')} {/* For DD/MM/YYYY */}
                </p>
              </div>

            </div>
            <div className="flex flex-col items-end">
              {status === 'pending' && getDueDateStatus(assignment.dueDate) ? (
                <div className="flex items-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, assignment._id)}
                    className="hidden"
                    id={`file-upload-${assignment._id}`}
                    disabled={!isStudent}
                  />
                  <label
                    htmlFor={`file-upload-${assignment._id}`}
                    className={`cursor-pointer ${!isStudent ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'} text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center`}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isStudent ? 'Choose File' : 'Unauthorized'}
                  </label>
                </div>
              ) : status === 'pending' ? (
                <span className="text-red-500 font-semibold flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Past Deadline
                </span>
              ) : assignment.file ? (
                <a
                  href={`/uploads/${assignment.file}`}
                  className="flex items-center text-blue-500 hover:underline transition-colors duration-300"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {assignment.file}
                </a>
              ) : (
                <span className="text-gray-500 italic">No file uploaded</span>
              )}
            </div>

          </div>
        </div>
      ));
    },
    [assignments, getDueDateStatus, handleFileChange]
  );

  const renderFileDetails = useCallback((file) => {
    if (!file) return null;
    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h5 className="font-semibold mb-2">Selected File Details:</h5>
        <p>Name: {file.name}</p>
        <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
        <p>Type: {file.type}</p>
      </div>
    );
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Assignments Dashboard</h2>

        {notification.message && (
          <div
            className={`mb-6 p-4 rounded-lg ${notification.type === 'error'
              ? 'bg-red-100 text-red-700 border border-red-400'
              : 'bg-green-100 text-green-700 border border-green-400'
              }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle className="inline-block w-4 h-4 mr-2" />
            ) : (
              <Check className="inline-block w-4 h-4 mr-2" />
            )}
            {notification.message}
          </div>
        )}

        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-gray-700">Pending Assignments</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader className="animate-spin w-8 h-8 text-blue-500" />
            </div>
          ) : (
            renderAssignmentList('pending')
          )}
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-gray-700">Submitted Assignments</h3>
          {renderAssignmentList('submitted')}
        </div>

        {selectedFile && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            {renderFileDetails(selectedFile)}
            {isLoading ? (
              <div className="mt-4 space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-center text-gray-600">Uploading... {uploadProgress}%</p>
              </div>
            ) : (
              <button
                onClick={handleFileUpload}
                disabled={isLoading}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center justify-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Submit Assignment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;