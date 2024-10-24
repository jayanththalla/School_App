import React, { useState, useEffect } from 'react';
// import mongoose from 'mongoose'; (Replace with actual ID source, such as session or global state)

const TClassDiary = ({ teacherId }) => {
  // Grouped state to manage form data
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    classSelected: '',
    sectionSelected: '',
    subjectSelected: '',
    diaryEntry: ''
  });
  
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for diary fetching
  const [submitting, setSubmitting] = useState(false); // Loading state for form submission
  const [error, setError] = useState(null);

  // Fetch previous diary entries for the teacher
  useEffect(() => {
    const fetchDiaries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/diary/${formData.date}`);
        const result = await response.json();
        if (result.success) setDiaries(result.data);
        else setDiaries([]);
      } catch (err) {
        console.error('Error fetching diaries:', err);
        setError('Failed to load previous diary entries.');
      }
      setLoading(false);
    };
    fetchDiaries();
  }, [formData.date]);

  // Update form data in one function
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { date, subjectSelected, diaryEntry, classSelected, sectionSelected } = formData;

    // Check if all fields are filled out before submitting
    if (!date || !subjectSelected || !diaryEntry || !classSelected || !sectionSelected) {
      alert('Please fill in all fields.');
      return;
    }

    const newDiary = {
      date,
      subject: subjectSelected,
      content: diaryEntry,
      teacherId, // Use the passed teacher ID instead of generating a new one
      classSelected,
      sectionSelected,
    };

    setSubmitting(true);
    try {
      const response = await fetch('/api/diary/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDiary),
      });

      if (response.ok) {
        const result = await response.json();
        setDiaries([result.data, ...diaries]); // Add new diary entry to the list
        alert('Class diary submitted successfully!');
        // Reset form
        setFormData({
          date: new Date().toISOString().split('T')[0],
          classSelected: '',
          sectionSelected: '',
          subjectSelected: '',
          diaryEntry: ''
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to submit diary:', errorData);
        setError('Failed to submit the diary entry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting diary:', error);
      setError('Error submitting the diary entry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 shadow-md rounded-lg max-w-3xl">
      <h2 className="text-2xl font-semibold text-center text-blue-800 mb-6">Upload Class Diary</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 font-bold mb-2">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="class" className="block text-gray-700 font-bold mb-2">Class:</label>
          <select
            id="class"
            name="classSelected"
            value={formData.classSelected}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Class</option>
            <option value="I">I</option>
            {/* Add other classes */}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="section" className="block text-gray-700 font-bold mb-2">Section:</label>
          <select
            id="section"
            name="sectionSelected"
            value={formData.sectionSelected}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Section</option>
            <option value="A">A</option>
            {/* Add other sections */}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700 font-bold mb-2">Subject:</label>
          <select
            id="subject"
            name="subjectSelected"
            value={formData.subjectSelected}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Subject</option>
            <option value="english">English</option>
            {/* Add other subjects */}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="diary" className="block text-gray-700 font-bold mb-2">Class Diary Entry:</label>
          <textarea
            id="diary"
            name="diaryEntry"
            rows="6"
            value={formData.diaryEntry}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Enter today's class diary..."
          ></textarea>
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={submitting}
            className={`bg-blue-700 text-white font-semibold py-2 px-4 rounded-md ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'}`}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
      
      {/* Error Message */}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      {/* Loading State */}
      {loading ? (
        <p className="text-gray-600 mt-10">Loading previous diary entries...</p>
      ) : (
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Previously Added Diaries</h3>
          {diaries.length === 0 ? (
            <p className="text-gray-600">No class diaries have been added yet.</p>
          ) : (
            <ul className="space-y-4">
              {diaries.map((diary, index) => (
                <li key={index} className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                  <p><strong>Date:</strong> {new Date(diary.date).toLocaleDateString()}</p>
                  <p><strong>Class:</strong> {diary.classSelected}</p>
                  <p><strong>Section:</strong> {diary.sectionSelected}</p>
                  <p><strong>Subject:</strong> {diary.subject}</p>
                  <p><strong>Diary Entry:</strong> {diary.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default TClassDiary;
