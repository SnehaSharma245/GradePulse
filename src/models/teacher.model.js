// To be modified later

import mongoose, { Schema } from "mongoose";

const teacherSchema = new Schema({
  teacherName: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  teacherEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const Teacher =
  mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);

export default Teacher;
