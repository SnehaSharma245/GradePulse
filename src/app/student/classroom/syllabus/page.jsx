"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

function page() {
  const searchParams = useSearchParams();
  const classroomCode = searchParams.get("classroomCode");
  console.log("Classroom Code:", classroomCode);
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleShowSyllabus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/syllabus?classroomCode=${classroomCode}`
      );
      console.log(response);
      if (response) {
        setSyllabus(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching syllabus:", error);
      toast("Failed to fetch syllabus. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleShowSyllabus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-medium text-gray-600 animate-pulse">
          Loading syllabus...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 "
    >
      {syllabus && syllabus.syllabusSubject ? (
        <>
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6 mt-15">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
              Processed Syllabus
            </h2>
          </div>

          {/* Syllabus Content */}
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
        </>
      ) : (
        /* Fallback UI when syllabus is unavailable */
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-yellow-100 rounded-full">
            <AlertTriangle className="w-12 h-12 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-orange-600">
            Syllabus Not Uploaded
          </h2>
          <p className="text-gray-700 text-lg">
            The syllabus for this classroom is not yet available. Please check
            back later.
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default page;
