import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Syllabus from "@/models/syllabus.model";
import dbConnect from "@/lib/dbConnect";
import Classroom from "@/models/classroom.model";

export async function POST(request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    console.log("Session: ", session);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }

    const user = session?.user;
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const url = new URL(request.url);
    const classroomCode = url.searchParams.get("classroomCode");
    if (!classroomCode) {
      return NextResponse.json(
        { error: "Classroom code is required" },
        { status: 400 }
      );
    }

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
    const { content } = await request.json();
    console.log("Content:", content);

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate 10 multiple choice questions (4 choices each) about ${content}. 
    Format each question as JSON with the following structure:
    {
      "question": "question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "correct option"
    }
    Return only the JSON array of questions. Do not include any markdown formatting or additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response text to ensure it's valid JSON
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const questions = JSON.parse(cleanText);

    // Validate the questions structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Invalid questions format");
    }

    // Validate each question
    questions.forEach((question, index) => {
      if (
        !question.question ||
        !Array.isArray(question.options) ||
        question.options.length !== 4 ||
        !question.correctAnswer
      ) {
        throw new Error(`Invalid question format at index ${index}`);
      }
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  }
}
