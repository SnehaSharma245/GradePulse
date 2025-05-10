import dbConnect from "@/lib/dbConnect";
import Classroom from "@/models/classroom.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import Student from "@/models/student.model";
import Teacher from "@/models/teacher.model";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    if (user.role === "teacher") {
      const teacher = await Teacher.findOne({ userId: user.id });
      if (!teacher) {
        return NextResponse.json(
          { success: false, message: "Teacher not found" },
          { status: 404 }
        );
      }

      const classrooms = await Classroom.find({
        teacher: user.id,
      });

      if (!classrooms) {
        return NextResponse.json(
          { success: false, message: "No classrooms found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          classrooms,
          message: "Classrooms fetched successfully",
        },
        { status: 200 }
      );
    }

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

      return NextResponse.json(
        {
          success: true,
          classrooms,
          message: "Classrooms fetched successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error creating classroom:", error);
    return NextResponse.json(
      { error: "Failed to create classroom" },
      { status: 500 }
    );
  }
}
