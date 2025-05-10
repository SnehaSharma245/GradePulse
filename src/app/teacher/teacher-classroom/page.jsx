"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link"; // Import Link
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";

function ShowClassrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSyllabus, setShowSyllabus] = useState(false);

  const fetchClassrooms = async () => {
    try {
      const result = await axios.post("/api/show-classrooms");

      if (result?.data?.success) {
        setClassrooms(result?.data?.classrooms);
        toast.success(
          result?.data?.message || "Classrooms fetched successfully"
        );
      } else {
        toast.error(result?.data?.message || "Failed to fetch classrooms");
      }
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50 p-6">
      <h1 className="text-4xl font-bold mb-8 text-purple-800">
        Your Classrooms
      </h1>

      {loading ? (
        <p className="text-purple-600">Loading classrooms...</p>
      ) : classrooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classrooms.map((classroom, index) => (
            <Card
              key={index}
              className="p-6 bg-purple-100 shadow-lg rounded-lg hover:shadow-2xl transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-purple-900">
                  {classroom.classroomName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-700">
                  <span className="font-semibold">Classroom Code:</span>{" "}
                  {classroom.classroomCode}
                </p>
                <p className="text-purple-700">
                  <span className="font-semibold">Students Enrolled:</span>{" "}
                  {classroom.students?.length || 0}
                </p>
                <Link
                  href={`/teacher/classroom/?classroomCode=${classroom.classroomCode}`}
                >
                  <Button className="mt-4 bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                    Show Classroom
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-purple-600">No classrooms found.</p>
      )}
    </div>
  );
}

export default ShowClassrooms;
