"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
import { FaChalkboardTeacher, FaSchool } from "react-icons/fa";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import Loading from "@/components/LoadingScreen";

function TeacherDashboard() {
  const [classroomName, setClassroomName] = useState("");
  const [classroomCode, setClassroomCode] = useState(null);
  const [generateCodeLoading, setGenerateCodeLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [classroomsLoading, setClassroomsLoading] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();
  const handleNavigation = (route) => {
    if (route === pathname) {
      return;
    }
    setClassroomsLoading(true);
  };

  useEffect(() => {
    return () => {
      setClassroomsLoading(false);
    };
  }, [pathname]);

  const generateClassroomCode = async () => {
    setGenerateCodeLoading(true);
    try {
      const result = await axios.get("/api/generate-classroom-code");

      setClassroomCode(result.data.classroomCode);
      setGenerateCodeLoading(false);
      toast.success("Classroom code generated!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to generate code");
    } finally {
      setGenerateCodeLoading(false);
    }
  };
  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    if (!classroomName || !classroomCode) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const result = await axios.post("/api/create-classroom", {
        classroomName,
        classroomCode,
      });
      if (result.data.success) {
        toast.success("Classroom created successfully!");
        setClassroomName("");
        setClassroomCode(null);
        setIsCreateModalOpen(false);
      } else {
        toast.error(result.data.message || "Failed to create classroom.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred.");
    }
  };

  const copyToClipboard = () => {
    if (classroomCode) {
      navigator.clipboard.writeText(classroomCode);
      toast.success("Classroom code copied to clipboard!");
    } else {
      toast.error("No code to copy!");
    }
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  if (!user) {
    return <Loading />;
  }

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
            <p className="text-xl text-gray-600">
              Manage your courses and students
            </p>
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
              <p className="text-gray-600 mb-4">
                View and analyze student performance
              </p>
              <button
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                onClick={() => router.push("/analytics")}
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
              <p className="text-gray-600 mb-4">
                View and respond to student feedback
              </p>
              <button
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all"
                onClick={() => router.push("/feedback")}
              >
                View Feedback
              </button>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {/* Create Classroom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow card-hover"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <LaptopMinimal className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Classroom</h3>
              <p className="text-gray-600 mb-4">
                View and analyze student performance
              </p>
              <button
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all "
                onClick={openCreateModal}
              >
                Open Classroom Form
              </button>
            </motion.div>

            {/* View Classroom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow card-hover"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FaChalkboardTeacher className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">View Classrooms</h3>
              <p className="text-gray-600 mb-4">View all the classrooms</p>
              <Link
                href="/teacher/teacher-classroom"
                onClick={() => handleNavigation("/teacher/teacher-classroom")}
              >
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all">
                  {classroomsLoading ? (
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
                      <span className="text-purple-100 font-semibold">
                        Loading...
                      </span>
                    </div>
                  ) : (
                    "View Classrooms"
                  )}
                </button>
              </Link>
            </motion.div>
          </div>

          {/*Create Classroom Modal */}
          {isCreateModalOpen && (
            <Dialog open={isCreateModalOpen} onOpenChange={closeCreateModal}>
              <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl shadow-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow max-w-lg w-full"
                >
                  {/* Close Button (Cross Icon) */}
                  <button
                    onClick={closeCreateModal}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                  >
                    <X size={24} />
                  </button>

                  {/* Dialog Content */}
                  <DialogHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <Clipboard className="h-6 w-6 text-purple-600" />
                    </div>
                    <DialogTitle className="text-xl font-semibold mb-2">
                      Create a New Classroom
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleCreateClassroom} className="space-y-4">
                    <div>
                      <label
                        htmlFor="classroomName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Classroom Name
                      </label>
                      <Input
                        id="classroomName"
                        name="classroomName"
                        type="text"
                        placeholder="Enter Classroom Name"
                        value={classroomName}
                        onChange={(e) => setClassroomName(e.target.value)}
                        className="mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full"
                        required
                      />
                    </div>

                    <div>
                      <Button
                        type="button"
                        onClick={generateClassroomCode}
                        className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 rounded-lg"
                      >
                        {generateCodeLoading ? (
                          <span className="flex items-center justify-center text-white">
                            <svg
                              className="animate-spin h-5 w-5 mr-2"
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
                                d="M4 12a8 8 0 0 1 16 0A8 8 0 0 1 4 12z"
                              />
                            </svg>
                            Generating...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center text-white">
                            <Clipboard size={16} className="mr-2" />
                            Generate Code
                          </span>
                        )}
                      </Button>

                      {classroomCode && (
                        <div className="flex justify-between items-center mt-2 text-gray-600 bg-gray-100 p-2 rounded-lg">
                          <span className="font-mono">{classroomCode}</span>
                          <Button
                            type="button"
                            onClick={copyToClipboard}
                            className="p-2 bg-gray-200 text-black hover:bg-gray-300 rounded-full"
                          >
                            <Clipboard size={16} />
                          </Button>
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                    >
                      Create Classroom
                    </Button>
                  </form>
                </motion.div>
              </div>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
