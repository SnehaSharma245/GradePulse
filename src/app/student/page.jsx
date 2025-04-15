"use client";

import { useState, useEffect } from "react";

const StudentPage = () => {
  const [syllabuses, setSyllabuses] = useState([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(null); // Track which button is loading
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchSyllabuses();
  }, []);

  useEffect(() => {
    if (quiz && !results) {  // Only run timer if quiz is active and not submitted
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz, results]);  // Add results to dependency array

  const fetchSyllabuses = async () => {
    try {
      const response = await fetch("/api/syllabus");
      const data = await response.json();
      setSyllabuses(data);
    } catch (error) {
      console.error("Error fetching syllabuses:", error);
      setError("Failed to fetch syllabuses");
    }
  };

  const generateQuiz = async (type, content) => {
    try {
      setLoading(true);
      setLoadingType(type); // Set which button is loading
      setError(null);
      
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz");
      }

      const questions = await response.json();
      setQuiz(questions);
      setTimeLeft(600);
      setAnswers({});
      setScore(null);
      setResults(null);
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
      setLoadingType(null); // Reset loading type
    }
  };

  const submitQuiz = () => {
    let correct = 0;
    const questionResults = quiz.map((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
      if (isCorrect) correct++;
      return {
        question: question.question,
        yourAnswer: answers[index] || "Not answered",
        correctAnswer: question.correctAnswer,
        isCorrect,
        options: question.options
      };
    });

    setScore(correct);
    setResults(questionResults);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!quiz ? (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                onChange={(e) => setSelectedSyllabus(e.target.value)}
                value={selectedSyllabus || ""}
              >
                <option value="" className="text-gray-800">Select Syllabus</option>
                {syllabuses.map((s) => (
                  <option key={s._id} value={s._id} className="text-gray-800">
                    {s.syllabusSubject}
                  </option>
                ))}
              </select>

              {selectedSyllabus && (
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  value={selectedChapter || ""}
                >
                  <option value="">Select Chapter</option>
                  {syllabuses
                    .find((s) => s._id === selectedSyllabus)
                    ?.chapters.map((chapter, index) => (
                      <option key={index} value={index}>
                        {chapter.chapterName}
                      </option>
                    ))}
                </select>
              )}

              {selectedChapter !== null && (
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  value={selectedTopic || ""}
                >
                  <option value="">Select Topic</option>
                  {syllabuses
                    .find((s) => s._id === selectedSyllabus)
                    ?.chapters[selectedChapter].topics.map((topic, index) => (
                      <option key={index} value={topic}>
                        {topic}
                      </option>
                    ))}
                </select>
              )}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              {selectedTopic && (
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={() =>
                    generateQuiz(
                      "topic",
                      `the topic "${selectedTopic}" from chapter "${
                        syllabuses.find((s) => s._id === selectedSyllabus)
                          ?.chapters[selectedChapter].chapterName
                      }" of ${syllabuses.find((s) => s._id === selectedSyllabus)?.syllabusSubject}`
                    )
                  }
                  disabled={loading}
                >
                  {loading && loadingType === "topic" ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    "Generate Quiz for Topic"
                  )}
                </button>
              )}

              {selectedChapter !== null && (
                <button
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={() =>
                    generateQuiz(
                      "chapter",
                      `the chapter "${
                        syllabuses.find((s) => s._id === selectedSyllabus)
                          ?.chapters[selectedChapter].chapterName
                      }" of ${syllabuses.find((s) => s._id === selectedSyllabus)?.syllabusSubject}`
                    )
                  }
                  disabled={loading}
                >
                  {loading && loadingType === "chapter" ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    "Generate Quiz for Chapter"
                  )}
                </button>
              )}

              {selectedSyllabus && (
                <button
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={() =>
                    generateQuiz(
                      "syllabus",
                      `the complete syllabus of ${syllabuses.find((s) => s._id === selectedSyllabus)?.syllabusSubject}`
                    )
                  }
                  disabled={loading}
                >
                  {loading && loadingType === "syllabus" ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    "Generate Quiz for Complete Syllabus"
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Quiz</h2>
              <div className="text-lg font-semibold px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                Time Remaining: {formatTime(timeLeft)}
              </div>
            </div>

            {!results ? (
              <div className="space-y-6">
                {quiz.map((question, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6">
                    <p className="text-lg font-semibold text-gray-800 mb-4">
                      {index + 1}. {question.question}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {question.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            answers[index] === option
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            checked={answers[index] === option}
                            onChange={(e) =>
                              setAnswers({ ...answers, [index]: e.target.value })
                            }
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                  onClick={submitQuiz}
                >
                  Submit Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Quiz Results</h3>
                  <p className="text-lg text-gray-900">
                    Your Score: <span className="font-semibold">{score} out of {quiz.length}</span> ({((score / quiz.length) * 100).toFixed(1)}%)
                  </p>
                </div>

                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-6 ${
                      result.isCorrect ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <p className="text-lg font-semibold text-gray-900 mb-4">
                      {index + 1}. {result.question}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-4 rounded-lg ${
                            option === result.correctAnswer
                              ? "bg-green-100 border-2 border-green-300 text-gray-900 font-medium"
                              : option === result.yourAnswer && !result.isCorrect
                              ? "bg-red-100 border-2 border-red-300 text-gray-900 font-medium"
                              : "bg-white border border-gray-200 text-gray-900"
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="font-semibold text-gray-900">
                        Your Answer:{" "}
                        <span
                          className={
                            result.isCorrect 
                              ? "text-green-800 font-bold"
                              : "text-red-800 font-bold"
                          }
                        >
                          {result.yourAnswer}
                        </span>
                      </p>
                      {!result.isCorrect && (
                        <p className="font-semibold text-gray-900">
                          Correct Answer:{" "}
                          <span className="text-green-800 font-bold">
                            {result.correctAnswer}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                  onClick={() => {
                    setQuiz(null);
                    setResults(null);
                    setScore(null);
                    setTimeLeft(600);
                  }}
                >
                  Take Another Quiz
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPage;
