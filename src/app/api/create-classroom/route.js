import dbConnect from "@/lib/dbConnect";
import Classroom from "@/models/classroom.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    console.log(session);
    const user = session?.user;
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    const { classroomName, classroomCode, teacherName } = await req.json();
    await Classroom.create({
      classroomCode,
      classroomName,
      teacher: user.id,
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
