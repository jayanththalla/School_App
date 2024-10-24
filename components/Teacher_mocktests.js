import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

  
const TeacherPanel = () => {
  const { data: session } = useSession();

  if (!session || session.user.role !== 'teacher') {
    return <div>Access denied</div>;
  }
  const [mockTestsData, setMockTestsData] = useState([]);
  const [newTest, setNewTest] = useState({
    title: '',
    questions: [{ question: '', options: { A: '', B: '', C: '', D: '' }, answer: '', explanation: '', image: '' }],
  });
  const [editingTest, setEditingTest] = useState(null);

  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        const res = await fetch('/api/mocktests');
        const result = await res.json();
        if (result.success) {
          setMockTestsData(result.data);
        }
      } catch (error) {
        console.error('Error fetching mock tests:', error);
      }
    };
    fetchMockTests();
  }, []);

  const handleCreateTest = async () => {
    try {
      const res = await fetch('/api/mocktests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTest),
      });
      const result = await res.json();
      if (result.success) {
        setMockTestsData([...mockTestsData, result.data]);
        setNewTest({
          title: '',
          questions: [{ question: '', options: { A: '', B: '', C: '', D: '' }, answer: '', explanation: '', image: '' }],
        });
      }
    } catch (error) {
      console.error('Error creating mock test:', error);
    }
  };

  const handleDeleteTest = async (id) => {
    try {
      await fetch(`/api/mocktests/${id}`, {
        method: 'DELETE',
      });
      setMockTestsData(mockTestsData.filter((test) => test._id !== id));
    } catch (error) {
      console.error('Error deleting mock test:', error);
    }
  };

  const handleEditTest = async (test) => {
    try {
      const res = await fetch(`/api/mocktests/${test._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test),
      });
      const result = await res.json();
      if (result.success) {
        setMockTestsData(mockTestsData.map((t) => (t._id === test._id ? result.data : t)));
        setEditingTest(null); // Reset after editing
      }
    } catch (error) {
      console.error('Error editing mock test:', error);
    }
  };

  const handleAddQuestion = () => {
    setNewTest({
      ...newTest,
      questions: [
        ...newTest.questions,
        { question: '', options: { A: '', B: '', C: '', D: '' }, answer: '', explanation: '', image: '' },
      ],
    });
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = newTest.questions.filter((_, i) => i !== index);
    setNewTest({ ...newTest, questions: updatedQuestions });
  };

  const handleUpdateNewQuestion = (index, field, value) => {
    const updatedQuestions = [...newTest.questions];
    updatedQuestions[index][field] = value;
    setNewTest({ ...newTest, questions: updatedQuestions });
  };

  const handleUpdateOption = (index, option, value) => {
    const updatedQuestions = [...newTest.questions];
    updatedQuestions[index].options[option] = value;
    setNewTest({ ...newTest, questions: updatedQuestions });
  };

  const handleUpdateAnswer = (index, value) => {
    const updatedQuestions = [...newTest.questions];
    updatedQuestions[index].answer = value;
    setNewTest({ ...newTest, questions: updatedQuestions });
  };

  const handleImageUpload = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedQuestions = [...newTest.questions];
      updatedQuestions[index].image = reader.result;
      setNewTest({ ...newTest, questions: updatedQuestions });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Teacher Panel</h1>

      {/* Create New Test */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Test</h2>
        <input
          type="text"
          value={newTest.title}
          onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
          placeholder="Test Title"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />

        {/* Question Inputs */}
        {newTest.questions.map((question, index) => (
          <div key={index} className="mb-6 border-t pt-4">
            <input
              type="text"
              placeholder={`Question ${index + 1}`}
              value={question.question}
              onChange={(e) => handleUpdateNewQuestion(index, 'question', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            
            {/* Image upload */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Attach Image</label>
              <input
                type="file"
                onChange={(e) => handleImageUpload(index, e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              {question.image && <img src={question.image} alt="Question" className="mt-4 w-32 h-32 object-cover" />}
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {['A', 'B', 'C', 'D'].map((option) => (
                <input
                  key={option}
                  type="text"
                  placeholder={`Option ${option}`}
                  value={question.options[option]}
                  onChange={(e) => handleUpdateOption(index, option, e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg"
                />
              ))}
            </div>

            {/* Answer */}
            <input
              type="text"
              placeholder="Correct Answer (A, B, C, D)"
              value={question.answer}
              onChange={(e) => handleUpdateAnswer(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mt-4"
            />

            {/* Explanation */}
            <textarea
              placeholder="Explanation (optional)"
              value={question.explanation}
              onChange={(e) => handleUpdateNewQuestion(index, 'explanation', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mt-4"
            />

            {/* Edit/Delete question buttons */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleDeleteQuestion(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete Question
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={handleAddQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Question
        </button>
        <button
          onClick={handleCreateTest}
          className="ml-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Create Test
        </button>
      </div>

      {/* Manage Tests */}
      <h2 className="text-2xl font-semibold mb-4">Manage Tests</h2>
      <ul className="space-y-4">
        {mockTestsData.map((test) => (
          <li key={test._id} className="bg-white p-4 rounded-lg shadow-lg flex justify-between">
            <span className="font-semibold text-lg">{test.title}</span>
            <div className="space-x-4">
              <button
                onClick={() => handleDeleteTest(test._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setEditingTest(test)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Test */}
      {editingTest && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
          <h2 className="text-xl font-semibold mb-4">Edit Test</h2>
          <input
            type="text"
            value={editingTest.title}
            onChange={(e) => setEditingTest({ ...editingTest, title: e.target.value })}
            placeholder="Test Title"
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          />

          {editingTest.questions.map((question, index) => (
            <div key={index} className="mb-6">
              <input
                type="text"
                placeholder={`Question ${index + 1}`}
                value={question.question}
                onChange={(e) => {
                  const updatedQuestions = [...editingTest.questions];
                  updatedQuestions[index].question = e.target.value;
                  setEditingTest({ ...editingTest, questions: updatedQuestions });
                }}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              {/* Image */}
              {question.image && <img src={question.image} alt="Question" className="mt-4 w-32 h-32 object-cover" />}

              <div className="grid grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <input
                    key={option}
                    type="text"
                    placeholder={`Option ${option}`}
                    value={question.options[option]}
                    onChange={(e) => {
                      const updatedQuestions = [...editingTest.questions];
                      updatedQuestions[index].options[option] = e.target.value;
                      setEditingTest({ ...editingTest, questions: updatedQuestions });
                    }}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                ))}
              </div>
              <input
                type="text"
                placeholder="Correct Answer (A, B, C, D)"
                value={question.answer}
                onChange={(e) => {
                  const updatedQuestions = [...editingTest.questions];
                  updatedQuestions[index].answer = e.target.value;
                  setEditingTest({ ...editingTest, questions: updatedQuestions });
                }}
                className="w-full p-2 border border-gray-300 rounded-lg mt-4"
              />

              {/* Explanation */}
              <textarea
                placeholder="Explanation (optional)"
                value={question.explanation}
                onChange={(e) => {
                  const updatedQuestions = [...editingTest.questions];
                  updatedQuestions[index].explanation = e.target.value;
                  setEditingTest({ ...editingTest, questions: updatedQuestions });
                }}
                className="w-full p-2 border border-gray-300 rounded-lg mt-4"
              />
            </div>
          ))}
          <button
            onClick={() => handleEditTest(editingTest)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherPanel;
