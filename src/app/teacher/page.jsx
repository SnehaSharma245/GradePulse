'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, BookOpen, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Teacher Dashboard</h1>
        
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
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
              <label
                htmlFor="pdf-upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                Select PDF
              </label>
              {selectedFile && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {uploading ? 'Processing...' : 'Upload & Process'}
                </button>
              )}
            </div>
          </div>
          {selectedFile && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{selectedFile.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Syllabus Display */}
        {syllabus && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Processed Syllabus</h2>
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
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">
                        Chapter {index + 1}: {chapter.chapterName}
                      </h4>
                      <div className="ml-4 space-y-2">
                        {chapter.topics.map((topic, tIndex) => (
                          <p key={tIndex} className="text-gray-700">• {topic}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;