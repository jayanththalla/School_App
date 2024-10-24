import React, { useState, useEffect } from 'react';
import { CheckIcon, XIcon } from '@heroicons/react/solid';

const MockTests = () => {
  const [mockTestsData, setMockTestsData] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

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

  useEffect(() => {
    if (selectedTest && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft]);

  const handleTestSelect = (test) => {
    setSelectedTest(test);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(60); // Reset timer for first question
  };

  const handleChoiceSelect = (questionId, choice) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: choice });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(60); // Reset timer for next question
    } else {
      calculateScore();
    }
  };

  const calculateScore = async () => {
    let score = 0;
    selectedTest.questions.forEach((question) => {
      if (selectedAnswers[question._id] === question.answer) score++;
    });

    selectedTest.userScore = `${score}/${selectedTest.questions.length}`;

    await fetch(`/api/mocktests/${selectedTest._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userScore: selectedTest.userScore }),
    });

    setSelectedTest(null);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-r from-blue-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Mock Tests</h1>

      <div className="w-full max-w-md mb-6">
        {mockTestsData.length === 0 ? (
          <p className="text-gray-600">Loading mock tests...</p>
        ) : (
          mockTestsData.map((test) => (
            <div
              key={test._id}
              className="flex justify-between items-center p-4 mb-4 bg-white shadow-lg rounded-lg hover:bg-blue-100 cursor-pointer transition duration-300"
              onClick={() => handleTestSelect(test)}
            >
              <div className="text-lg font-semibold">{test.title}</div>
              <div className="text-sm text-gray-600">
                {test.userScore ? `Score: ${test.userScore}` : 'Pending'}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedTest && (
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">{selectedTest.title}</h2>
          <div key={selectedTest.questions[currentQuestionIndex]._id} className="mb-6">
            <p className="text-md font-medium text-gray-800 mb-3">
              {selectedTest.questions[currentQuestionIndex].question}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(selectedTest.questions[currentQuestionIndex].options).map((key) => (
                <button
                  key={key}
                  className={`p-3 rounded-lg border text-left transition duration-300 ${
                    selectedAnswers[selectedTest.questions[currentQuestionIndex]._id]
                      ? selectedAnswers[selectedTest.questions[currentQuestionIndex]._id] === key
                        ? selectedAnswers[selectedTest.questions[currentQuestionIndex]._id] ===
                          selectedTest.questions[currentQuestionIndex].answer
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : 'bg-red-100 border-red-500 text-red-700'
                        : 'border-gray-300 bg-gray-100'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() =>
                    handleChoiceSelect(
                      selectedTest.questions[currentQuestionIndex]._id,
                      key
                    )
                  }
                  disabled={
                    !!selectedAnswers[selectedTest.questions[currentQuestionIndex]._id]
                  }
                >
                  <span className="font-semibold">{key}. </span>
                  {selectedTest.questions[currentQuestionIndex].options[key]}
                </button>
              ))}
            </div>
            {selectedAnswers[selectedTest.questions[currentQuestionIndex]._id] && (
              <p className="text-sm mt-2 text-gray-600">
                {selectedAnswers[selectedTest.questions[currentQuestionIndex]._id] ===
                selectedTest.questions[currentQuestionIndex].answer ? (
                  <span className="text-green-600">
                    <CheckIcon className="h-5 w-5 inline-block" /> Correct!{' '}
                    {
                      selectedTest.questions[currentQuestionIndex]
                        .explanation
                    }
                  </span>
                ) : (
                  <span className="text-red-600">
                    <XIcon className="h-5 w-5 inline-block" /> Incorrect.{' '}
                    {
                      selectedTest.questions[currentQuestionIndex]
                        .explanation
                    }
                  </span>
                )}
              </p>
            )}
          </div>
          <p>Time Left: {timeLeft} seconds</p>
          <button
            className="w-full p-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            onClick={handleNextQuestion}
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

export default MockTests;
