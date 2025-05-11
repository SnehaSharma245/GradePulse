"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BarChart3, Folder } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";

function StudentDashboard() {
  const [classroomCode, setClassroomCode] = useState("");
  const { data: session } = useSession();
  const user = session?.user;
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const handleInputChange = (e) => {
    setClassroomCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/api/join-classroom", {
        classroomCode,
      });

      if (result?.data?.success) {
        toast.success(result.data.message);
        setClassroomCode("");
        setIsJoinModalOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to join classroom");
    }
  };

  const openJoinModal = () => setIsJoinModalOpen(true);
  const closeJoinModal = () => setIsJoinModalOpen(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-12 px-6">
      <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {/* Join Classroom Card */}
        <Card
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow card-hover"
        >
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-xl font-semibold  text-gray-800">
              Join a Classroom
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Enter a classroom code to join and start learning.
            </p>
            <Button
              onClick={openJoinModal}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              Enter Code
            </Button>
          </CardContent>
        </Card>

        {/* My Classrooms Card */}
        <Card
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow card-hover"
        >
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Folder className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-800">
              My Classrooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Access all the classrooms you've joined in one place.
            </p>
            <Link href="/student/student-classrooms">
              <Button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all">
                View All
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Join Classroom Modal */}
      <Dialog open={isJoinModalOpen} onOpenChange={closeJoinModal}>
        <DialogContent className="max-w-md bg-white rounded-lg p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-indigo-600">
              Join a Classroom
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="classroomCode"
                className="block text-sm font-medium text-gray-700"
              >
                Classroom Code
              </label>
              <Input
                id="classroomCode"
                name="classroomCode"
                type="text"
                placeholder="Enter Classroom Code"
                value={classroomCode}
                onChange={handleInputChange}
                className="mt-1 border-gray-300 focus:ring-indigo-600 focus:border-indigo-600"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg"
            >
              Join Now
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentDashboard;
