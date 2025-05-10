import dbConnect from "@/lib/dbConnect";
import Classroom from "@/models/classroom.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import Student from "@/models/student.model";
import Teacher from "@/models/teacher.model";

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user = session?.user;

    // Access query params from the request URL
    const url = new URL(req.url);

    const classroomCode = url.searchParams.get("classroomCode");

    if (!classroomCode) {
      return NextResponse.json(
        { success: false, message: "Classroom code is required" },
        { status: 400 }
      );
    }

    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    // Check for teacher role
    if (user.role === "teacher") {
      const teacher = await Teacher.findOne({ userId: user.id });
      if (!teacher) {
        return NextResponse.json(
          { success: false, message: "Teacher not found" },
          { status: 404 }
        );
      }

      const classroom = await Classroom.findOne({
        classroomCode: classroomCode,
        teacher: user.id,
      });

      if (!classroom) {
        return NextResponse.json(
          { success: false, message: "Classroom not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          classroom,
          message: "Classroom fetched successfully",
        },
        { status: 200 }
      );
    }

    // Check for student role
    if (user.role === "student") {
      const student = await Student.findOne({ userId: user.id }).populate(
        "classrooms"
      );
      if (!student) {
        return NextResponse.json(
          { success: false, message: "Student not found" },
          { status: 404 }
        );
      }

      const classrooms = student.classrooms;
      if (!classrooms || classrooms.length === 0) {
        return NextResponse.json(
          { success: false, message: "No classrooms found" },
          { status: 404 }
        );
      }

      // Filter the classrooms if needed
      const classroom = classrooms.find(
        (classroom) => classroom.classroomCode === classroomCode
      );

      if (!classroom) {
        return NextResponse.json(
          { success: false, message: "Classroom not found in student profile" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          classroom,
          message: "Classroom fetched successfully",
        },
        { status: 200 }
      );
    }

    // If user role is neither teacher nor student
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error fetching classroom:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch classroom" },
      { status: 500 }
    );
  }
}
