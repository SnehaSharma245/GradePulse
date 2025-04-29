import { NextResponse } from "next/server";
import Classroom from "@/models/classroom.model";
import dbConnect from "@/lib/dbConnect";

export async function GET(req) {
  try {
    await dbConnect();
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();

    // Step 2: Fetch count of documents in the Classroom collection
    const count = await Classroom.countDocuments();

    // Step 3: Append count to the random code to ensure uniqueness
    const classroomCode = `${randomCode}${count}`;

    return NextResponse.json(
      {
        success: true,
        message: "Generated classroom code",
        classroomCode,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating classroom code:", error);
    return NextResponse.json(
      { error: "Failed to generate classroom code" },
      { status: 500 }
    );
  }
}
