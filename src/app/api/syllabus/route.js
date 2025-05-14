import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Syllabus from "@/models/syllabus.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Classroom from "@/models/classroom.model";
import Teacher from "@/models/teacher.model";

export async function GET(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const url = new URL(req.url);
    const classroomCode = url.searchParams.get("classroomCode");

    if (!classroomCode) {
      return NextResponse.json(
        { success: false, message: "Classroom code is required" },
        { status: 400 }
      );
    }
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
      const classroom = await Classroom.findOne({
        classroomCode: classroomCode,
        teacher: teacher._id,
      });

      if (!classroom) {
        return NextResponse.json(
          { success: false, message: "Classroom not found" },
          { status: 404 }
        );
      }
      const syllabusId = classroom.syllabusId;

      if (!syllabusId) {
        return NextResponse.json(
          { success: false, message: "Syllabus not found" },
          { status: 404 }
        );
      }
      const syllabus = await Syllabus.findById(syllabusId);
      if (!syllabus) {
        return NextResponse.json(
          { success: false, message: "Syllabus not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(syllabus);
    }

    if (user.role === "student") {
      const classroom = await Classroom.findOne({
        classroomCode: classroomCode,
      });
      if (!classroom) {
        return NextResponse.json(
          { success: false, message: "Classroom not found" },
          { status: 404 }
        );
      }
      const syllabusId = classroom.syllabusId;

      if (!syllabusId) {
        return NextResponse.json(
          { success: false, message: "Syllabus not found" },
          { status: 404 }
        );
      }
      const syllabus = await Syllabus.findById(syllabusId);
      if (!syllabus) {
        return NextResponse.json(
          { success: false, message: "Syllabus not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(syllabus);
    }
  } catch (error) {
    console.error("Error fetching syllabuses:", error);
    return NextResponse.json(
      { error: "Failed to fetch syllabuses" },
      { status: 500 }
    );
  }
}
