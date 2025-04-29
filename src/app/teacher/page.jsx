"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, FileText, BookOpen, CheckCircle, Brain, BarChart3, MessageSquare } from 'lucide-react';

function TeacherDashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [syllabus, setSyllabus] = useState(null);
  const router = useRouter();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const response = await fetch('/api/process-syllabus', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process syllabus');

      const data = await response.json();
      setSyllabus(data);
    } catch (error) {
      console.error('Error uploading syllabus:', error);
      alert('Failed to process syllabus. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              Teacher Dashboard
            </h1>
            <p className="text-xl text-gray-600">Manage your courses and students</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow card-hover"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Student Analytics</h3>
              <p className="text-gray-600 mb-4">View and analyze student performance</p>
              <button
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                onClick={() => router.push('/analytics')}
              >
                View Analytics
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow card-hover"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Student Feedback</h3>
              <p className="text-gray-600 mb-4">View and respond to student feedback</p>
              <button
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all"
                onClick={() => router.push('/feedback')}
              >
                View Feedback
              </button>
            </motion.div>
          </div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Upload Syllabus</h2>
                  <p className="text-gray-600">Upload your syllabus PDF to process with Gemini AI</p>
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
                    {uploading ? 'Processing...' : 'Upload & Process'}
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

          {/* Syllabus Display */}
          {syllabus && (
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
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Subject</h3>
                  <p className="text-gray-900">{syllabus.syllabusSubject}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-900">{syllabus.syllabusDescription}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Chapters</h3>
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
                            <p key={tIndex} className="text-gray-700">• {topic}</p>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;