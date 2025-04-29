"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

function ShowClassrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClassrooms = async () => {
    try {
      const result = await axios.post("/api/show-classrooms");
      console.log("API Response:", result?.data);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Your Classrooms</h1>

      {loading ? (
        <p className="text-gray-500">Loading classrooms...</p>
      ) : classrooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom, index) => (
            <Card key={index} className="p-4 bg-white shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {classroom.classroomName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <span className="font-semibold">Classroom Code:</span>{" "}
                  {classroom.classroomCode}
                </p>
                <p>
                  <span className="font-semibold">Students Enrolled:</span>{" "}
                  {classroom.students?.length || 0}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No classrooms found.</p>
      )}
    </div>
  );
}

export default ShowClassrooms;
