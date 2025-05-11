"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  BookOpen,
  CheckCircle,
  Brain,
  BarChart3,
  MessageSquare,
  Clipboard,
  X,
  LaptopMinimal,
} from "lucide-react";
import { toast } from "sonner";

function ClassroomPage() {
  const searchParams = useSearchParams();
  const classroomCode = searchParams.get("classroomCode"); // Get classroomCode from URL params
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [syllabus, setSyllabus] = useState(null);
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);

  useEffect(() => {
    if (classroomCode) {
      fetchClassroom();
    }
  }, [classroomCode]);

  const fetchClassroom = async () => {
    try {
      const response = await axios.post(
        `/api/fetch-classroom-details?classroomCode=${classroomCode}`
      );

      setClassroom(response.data.classroom);
    } catch (error) {
      console.error("Error fetching classroom:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("classroomCode", classroomCode);

      const response = await axios.post("/api/process-syllabus", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for uploading files
        },
      });

      const data = await response.data;
      setSyllabus(data);
    } catch (error) {
      console.error("Error uploading syllabus:", error);
      toast("Failed to process syllabus. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleShowSyllabus = async () => {
    setLoadingSyllabus(true);
    try {
      const response = await axios.get(
        `/api/syllabus?classroomCode=${classroomCode}`
      );
      if (response) {
        setShowSyllabus(!showSyllabus);
        setSyllabus(response.data);
      }
    } catch (error) {
      console.error("Error fetching syllabus:", error);
      toast("Failed to fetch syllabus. Please try again.");
    } finally {
      setLoadingSyllabus(false);
    }
  };
  useEffect(() => {
    console.log(syllabus);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-purple-50">
        <p className="text-purple-700 text-xl">Loading classroom details...</p>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-purple-50">
        <p className="text-red-600 text-xl">Classroom not found!</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-purple-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-purple-900 mb-8 mt-24 text-center">
        Classroom: {classroom.classroomName}
      </h1>

      <Card className="p-6 bg-purple-100 shadow-lg rounded-lg max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-purple-900">
            Classroom Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-700 mb-4 text-lg">
            <strong className="font-semibold">Classroom Code:</strong>{" "}
            {classroom.classroomCode}
          </p>
          <p className="text-purple-700 mb-4 text-lg">
            <strong className="font-semibold">Total Students:</strong>{" "}
            {classroom.students?.length || 0}
          </p>
          <h2 className="text-xl font-semibold text-purple-800 mt-6">
            Enrolled Students:
          </h2>
          <ul className="list-disc list-inside text-purple-700 mt-2">
            {classroom.students && classroom.students.length > 0 ? (
              classroom.students.map((student, index) => (
                <li key={index}>{student}</li>
              ))
            ) : (
              <li>No students enrolled yet.</li>
            )}
          </ul>
        </CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Upload Syllabus
                </h2>
                <p className="text-gray-600">
                  Upload your syllabus PDF to process with Gemini AI
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />
              <motion.label
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                htmlFor="pdf-upload"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 cursor-pointer transition-all"
              >
                Select PDF
              </motion.label>
              {selectedFile && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all"
                >
                  {uploading ? "Processing..." : "Upload & Process"}
                </motion.button>
              )}
            </div>
          </div>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{selectedFile.name}</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleShowSyllabus}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all w-fit mx-auto cursor-pointer"
        >
          {loadingSyllabus ? (
            <div className="flex items-center space-x-2 cursor-not-allowed">
              <svg
                className="animate-spin h-6 w-6 text-purple-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M12 2a10 10 0 0 1 10 10H12V2z"
                />
              </svg>
              <span className="text-purple-100 font-semibold">Loading...</span>
            </div>
          ) : showSyllabus ? (
            "Hide Syllabus"
          ) : (
            "Show Syllabus"
          )}
        </motion.button>

        {showSyllabus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
                Processed Syllabus
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Subject
                </h3>
                <p className="text-gray-900">{syllabus.syllabusSubject}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Description
                </h3>
                <p className="text-gray-900">{syllabus.syllabusDescription}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Chapters
                </h3>
                <div className="space-y-4">
                  {syllabus.chapters.map((chapter, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <h4 className="text-lg font-medium text-gray-800 mb-2">
                        Chapter {index + 1}: {chapter.chapterName}
                      </h4>
                      <div className="ml-4 space-y-2">
                        {chapter.topics.map((topic, tIndex) => (
                          <p key={tIndex} className="text-gray-700">
                            • {topic}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
}

export default ClassroomPage;
