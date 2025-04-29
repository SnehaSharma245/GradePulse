import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import sendVerificationMail from "@/utils/sendVerificationMail";
import Student from "@/models/student.model";
import Teacher from "@/models/teacher.model";

export async function POST(req) {
  try {
    const { name, email, password, role, username } = await req.json();
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create new user
    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      role,
      verifyCode: otp,
      verifyCodeExpiry: otpExpiry,
    });

    if (role == "student") {
      await Student.create({
        studentName: name,
        studentEmail: email,
        userId: user._id,
        classrooms: [],
      });
    }

    if (role == "teacher") {
      await Teacher.create({
        teacherName: name,
        teacherEmail: email,
        userId: user._id,
      });
    }

    // Send verification email
    await sendVerificationMail(email, otp);

    return NextResponse.json(
      {
        message:
          "User registered successfully. Please check your email for verification.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error registering user" },
      { status: 500 }
    );
  }
}
