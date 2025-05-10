import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Syllabus from "@/models/syllabus.model";
import dbConnect from "@/lib/dbConnect";
import Classroom from "@/models/classroom.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req) {
  try {
    // Connect to MongoDB
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user = session?.user;
    const formData = await req.formData();

    const file = formData.get("pdf");

    const url = new URL(req.url);
    const classroomCode =
      formData.get("classroomCode") || url.searchParams.get("classroomCode");

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

    const classroom = await Classroom.findOne({
      classroomCode: classroomCode,
      teacher: user.id,
    });

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer and base64
    const bytes = await file.arrayBuffer();
    const pdfBuffer = Buffer.from(bytes);

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Process PDF with Gemini
    const result = await model.generateContent([
      {
        inlineData: {
          data: pdfBuffer.toString("base64"),
          mimeType: "application/pdf",
        },
      },

      `You are a syllabus analyzer. Extract the following information from this syllabus PDF:

1. Subject Name: Extract the main subject/topic of the syllabus
2. Description: Extract a brief description or overview of the subject
3. Chapters and Topics: Extract all chapters and their corresponding topics

Format your response as a JSON object with this exact structure:
{
  "syllabusSubject": "subject name here",
  "syllabusDescription": "description here",
  "chapters": [
    {
      "chapterName": "chapter name here",
      "topics": ["topic 1", "topic 2", "topic 3"]
    }
  ]
}

Important rules:
1. Return ONLY the JSON object, nothing else
2. Use double quotes for all strings
3. Make sure topics is always an array of strings
4. Do not include any markdown formatting or code blocks
5. Do not add any explanations or additional text
6. Ensure the JSON is valid and can be parsed directly
7. Each topic should be a clear, distinct point from the syllabus
8. Topics should be extracted in the order they appear in the syllabus
9. Remove any numbering or bullet points from the topics`,
    ]);

    const response = await result.response;
    let text = response.text().trim();

    // Clean up the response string
    text = text.replace(/^```json\s*|\s*```$/g, ""); // Remove markdown code block markers
    text = text.replace(/^["']|["']$/g, ""); // Remove surrounding quotes if any
    text = text.replace(/\\"/g, '"'); // Replace escaped quotes with regular quotes
    text = text.trim(); // Remove any extra whitespace

    // Parse the JSON response
    const syllabusData = JSON.parse(text);

    // Process topics to ensure they are clean and properly formatted
    syllabusData.chapters = syllabusData.chapters.map((chapter) => ({
      ...chapter,
      topics: chapter.topics.map((topic) =>
        topic
          .trim()
          .replace(/^\d+\.\s*/, "") // Remove leading numbers
          .replace(/^[-•]\s*/, "") // Remove leading bullets
          .trim()
      ), // Remove empty topics
    }));

    // Create syllabus document
    const syllabus = new Syllabus(syllabusData);
    await syllabus.save();

    // Update classroom with syllabus ID
    await Classroom.findByIdAndUpdate(classroom._id, {
      syllabusId: syllabus._id,
    });

    return NextResponse.json(syllabusData);
  } catch (error) {
    console.error("Error processing syllabus:", error);
    return NextResponse.json(
      { error: "Failed to process syllabus" },
      { status: 500 }
    );
  }
}
