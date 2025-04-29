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
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import { Clipboard } from "lucide-react";

function TeacherDashboard() {
  const [classroomName, setClassroomName] = useState("");
  const [classroomCode, setClassroomCode] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const generateClassroomCode = async () => {
    try {
      const result = await axios.get("/api/generate-classroom-code");
      setClassroomCode(result.data.classroomCode);
      toast.success("Classroom code generated!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to generate code");
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

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-8">
      {/* Create Classroom Card */}
      <Card className="w-full max-w-sm p-6 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Create Classroom
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            Open Classroom Form
          </Button>
        </CardContent>
      </Card>

      {/* View Classrooms Card */}
      <Card className="w-full max-w-sm p-6 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            View Classrooms
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/teacher-classroom">
            <Button className="bg-green-600 hover:bg-green-700 w-full">
              Go to Classrooms Page
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Create Classroom Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={closeCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
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
                className="mt-1"
                required
              />
            </div>
            <div>
              <Button
                type="button"
                onClick={generateClassroomCode}
                className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Generate Classroom Code
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
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Create Classroom
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TeacherDashboard;
