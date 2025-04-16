"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Clock, CheckCircle2, XCircle, BookOpen } from "lucide-react";

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
  const [loadingType, setLoadingType] = useState(null);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchSyllabuses();
  }, []);

  useEffect(() => {
    if (quiz && !results) {
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
  }, [quiz, results]);

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
      setLoadingType(type);
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
      setLoadingType(null);
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Student Dashboard
          </h1>
          <p className="text-xl text-gray-600">Test your knowledge with AI-powered quizzes</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6"
          >
            {error}
          </motion.div>
        )}

        {!quiz ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 space-y-6"
          >
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                    <>
                      <Brain className="h-5 w-5" />
                      Generate Quiz for Topic
                    </>
                  )}
                </motion.button>
              )}

              {selectedChapter !== null && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                    <>
                      <BookOpen className="h-5 w-5" />
                      Generate Quiz for Chapter
                    </>
                  )}
                </motion.button>
              )}

              {selectedSyllabus && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                    <>
                      <Brain className="h-5 w-5" />
                      Generate Quiz for Complete Syllabus
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 space-y-6"
          >
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Quiz
              </h2>
              <div className="flex items-center gap-2 text-lg font-semibold px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-lg">
                <Clock className="h-5 w-5" />
                Time Remaining: {formatTime(timeLeft)}
              </div>
            </div>

            {!results ? (
              <div className="space-y-6">
                {quiz.map((question, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-6"
                  >
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
                  </motion.div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-lg font-semibold"
                  onClick={submitQuiz}
                >
                  Submit Quiz
                </motion.button>
              </div>
            ) : (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100"
                >
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                    Quiz Results
                  </h3>
                  <p className="text-lg text-gray-900">
                    Your Score: <span className="font-semibold">{score} out of {quiz.length}</span> ({((score / quiz.length) * 100).toFixed(1)}%)
                  </p>
                </motion.div>

                {results.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
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
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        Your Answer:{" "}
                        <span
                          className={
                            result.isCorrect 
                              ? "text-green-800 font-bold flex items-center gap-1"
                              : "text-red-800 font-bold flex items-center gap-1"
                          }
                        >
                          {result.yourAnswer}
                          {result.isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
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
                  </motion.div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-lg font-semibold"
                  onClick={() => {
                    setQuiz(null);
                    setResults(null);
                    setScore(null);
                    setTimeLeft(600);
                  }}
                >
                  Take Another Quiz
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentPage;
