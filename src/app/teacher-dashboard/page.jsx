"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

function TeacherDashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const [classroomCode, setClassroomCode] = useState(null);
  const [formData, setFormData] = useState({
    classroomName: "",
    classroomCode: "",
    teacherName: user?.name,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateClassroomCode = async () => {
    try {
      const result = await axios.get("/api/generate-classroom-code");
      setClassroomCode(result.data.classroomCode);
    } catch (error) {
      console.error(
        error?.response?.data?.message || "Failed to create classroom code"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/api/create-classroom", {
        ...formData,
        classroomCode,
        teacherName: user?.name,
      });
      if (result?.success) {
        toast.success(result?.message);
        setFormData({
          classroomName: "",
          classroomCode: "",
          teacherName: user?.name,
        });
        setClassroomCode(null);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create classroom"
      );
      console.error(
        error?.response?.data?.message || "Failed to create classroom"
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Create Classroom
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter classroom name"
                value={formData.classroomName}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={generateClassroomCode}
                className="w-full"
              >
                Generate Classroom Code
              </Button>
            </div>

            {classroomCode && (
              <div className="bg-gray-200 p-2 rounded mt-2 text-center">
                Classroom Code:{" "}
                <span className="font-mono font-semibold">{classroomCode}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Add Classroom
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default TeacherDashboard;
