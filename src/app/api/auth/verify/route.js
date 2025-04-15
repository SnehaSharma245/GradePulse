import { NextResponse } from "next/server";
import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    await dbConnect();
    console.log(email, otp);
    
    

    const user = await User.findOne({ email : email });
    console.log(user);


    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      console.log("User already verified");
      return NextResponse.json(
        { error: "User already verified" },
        { status: 400 }
      );
    }

    if (user.verifyCode !== otp) {
      console.log("Invalid OTP");
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    if (user.verifyCodeExpiry < new Date()) {
      console.log("OTP expired");
      return NextResponse.json(
        { error: "OTP expired" },
        { status: 400 }
      );
    }

    // Update user verification status
    user.isVerified = true;
    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Error verifying email" },
      { status: 500 }
    );
  }
} 