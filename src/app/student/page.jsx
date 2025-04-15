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
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchSyllabuses();
  }, []);

  useEffect(() => {
    if (quiz) {
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
  }, [quiz]);

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!quiz ? (
        <div className="space-y-4">
          <div className="flex gap-4">
            <select
              className="p-2 border rounded"
              onChange={(e) => setSelectedSyllabus(e.target.value)}
              value={selectedSyllabus || ""}
            >
              <option value="">Select Syllabus</option>
              {syllabuses.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.syllabusSubject}
                </option>
              ))}
            </select>

            {selectedSyllabus && (
              <select
                className="p-2 border rounded"
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
                className="p-2 border rounded"
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

          <div className="flex gap-4">
            {selectedTopic && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
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
                {loading ? "Generating..." : "Generate Quiz for Topic"}
              </button>
            )}

            {selectedChapter !== null && (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
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
                {loading ? "Generating..." : "Generate Quiz for Chapter"}
              </button>
            )}

            {selectedSyllabus && (
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={() =>
                  generateQuiz(
                    "syllabus",
                    `the complete syllabus of ${syllabuses.find((s) => s._id === selectedSyllabus)?.syllabusSubject}`
                  )
                }
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Quiz for Complete Syllabus"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Quiz</h2>
            <div className="text-xl font-bold">
              Time Remaining: {formatTime(timeLeft)}
            </div>
          </div>

          {!results ? (
            <>
              {quiz.map((question, index) => (
                <div key={index} className="border p-4 rounded">
                  <p className="font-bold mb-2">
                    {index + 1}. {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={answers[index] === option}
                          onChange={(e) =>
                            setAnswers({ ...answers, [index]: e.target.value })
                          }
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={submitQuiz}
              >
                Submit Quiz
              </button>
            </>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                <h3 className="text-xl font-bold mb-2">Quiz Results</h3>
                <p className="text-lg">
                  Your Score: {score} out of {quiz.length} ({((score / quiz.length) * 100).toFixed(1)}%)
                </p>
              </div>

              {results.map((result, index) => (
                <div
                  key={index}
                  className={`border p-4 rounded ${
                    result.isCorrect ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p className="font-bold mb-2">
                    {index + 1}. {result.question}
                  </p>
                  <div className="space-y-2">
                    {result.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded ${
                          option === result.correctAnswer
                            ? "bg-green-200"
                            : option === result.yourAnswer && !result.isCorrect
                            ? "bg-red-200"
                            : ""
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <p className="font-semibold">
                      Your Answer:{" "}
                      <span
                        className={
                          result.isCorrect ? "text-green-600" : "text-red-600"
                        }
                      >
                        {result.yourAnswer}
                      </span>
                    </p>
                    {!result.isCorrect && (
                      <p className="text-green-600">
                        Correct Answer: {result.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setQuiz(null);
                  setResults(null);
                  setScore(null);
                }}
              >
                Take Another Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentPage;
