// To be modified later

import mongoose, { Schema } from "mongoose";

const classroomSchema = new Schema({
  classroomName: {
    type: String,
    required: true,
    trim: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
    trim: true,
  },
  syllabusId: {
    type: Schema.Types.ObjectId,
    ref: "Syllabus",
    trim: true,
  },
  classroomCode: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  students: {
    type: [Schema.Types.ObjectId],
    ref: "Student",
    required: true,
    trim: true,
  },
});

const Classroom =
  mongoose.models.Classroom || mongoose.model("Classroom", classroomSchema);

export default Classroom;
