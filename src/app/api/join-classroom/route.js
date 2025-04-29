import dbConnect from "@/lib/dbConnect";
import Classroom from "@/models/classroom.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import Student from "@/models/student.model";

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

    const student = await Student.findOne({ userId: user.id });
    console.log("student: ", student);
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }
    const { classroomCode } = await req.json();
    console.log(classroomCode);

    const joinedClassroom = await Classroom.findOneAndUpdate(
      { classroomCode },
      { $push: { students: student._id } },
      { new: true } // Returns the updated document
    );

    console.log("joinedClassroom ", joinedClassroom);

    if (!joinedClassroom) {
      return NextResponse.json(
        { success: false, message: "Classroom not found" },
        { status: 404 }
      );
    }

    const updatedUser = await Student.updateOne(
      { _id: student._id },
      { $push: { classrooms: joinedClassroom._id } }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "Unable to join classroom" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Classroom created successfully",
        joinedClassroom,
      },
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
