// To be modified later

import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  studentEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  classrooms: {
    type: [Schema.Types.ObjectId],
    ref: "Classroom",
    trim: true,
  },
});

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
