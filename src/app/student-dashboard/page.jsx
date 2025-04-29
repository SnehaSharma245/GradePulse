"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

function StudentDashboard() {
  const [classroomCode, setClassroomCode] = useState("");

  const handleInputChange = (e) => {
    setClassroomCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/api/join-classroom", {
        classroomCode,
      });
      console.log(result);
      if (result?.success) {
        toast.success(result.data.message);
        setClassroomCode("");
      }
    } catch (error) {
      toast.error(error?.result?.data?.message || "Failed to join classroom");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Join Classroom
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
            >
              Join Classroom
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default StudentDashboard;
