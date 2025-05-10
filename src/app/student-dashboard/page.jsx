"use client";
import React, { useEffect, useState } from "react";
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-8">
      {/* Join Classroom Card */}
      <Card className="w-full max-w-sm p-6 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Join Classroom
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={openJoinModal}
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            Open Join Classroom
          </Button>
        </CardContent>
      </Card>

      {/* Show Classrooms Card */}
      <Card className="w-full max-w-sm p-6 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Show Classrooms
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/student-classrooms">
            <Button className="bg-green-600 hover:bg-green-700 w-full">
              View Classrooms
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Join Classroom Modal */}
      <Dialog open={isJoinModalOpen} onOpenChange={closeJoinModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
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
                className="mt-1"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Join Classroom
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentDashboard;
