import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Syllabus from "@/models/syllabus.model";

export async function GET() {
  try {
    await dbConnect();
    
    const syllabuses = await Syllabus.find({})
    console.log(syllabuses);

    
    return NextResponse.json(syllabuses);
  } catch (error) {
    console.error("Error fetching syllabuses:", error);
    return NextResponse.json(
      { error: "Failed to fetch syllabuses" },
      { status: 500 }
    );
  }
} 