import dbConnect from "@/lib/dbConnect";
import Classroom from "@/models/classroom.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import Teacher from "@/models/teacher.model";

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

    const { classroomName, classroomCode, teacherName } = await req.json();

    const teacher = await Teacher.findOne({ userId: user.id });
    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }
    await Classroom.create({
      classroomCode,
      classroomName,
      teacher: teacher._id,
    });

    return NextResponse.json(
      { success: true, message: "Classroom created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating classroom:", error);
    return NextResponse.json(
      { error: "Failed to create classroom" },
      { status: 500 }
    );
  }
}
