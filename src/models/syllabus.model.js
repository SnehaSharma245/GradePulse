import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  chapterName: {
    type: String,
  },
  topics: {
    type: [String],
  }
});

const syllabusSchema = new mongoose.Schema({
  syllabusSubject: {
    type: String,
    required: true,
  },
  syllabusDescription: {
    type: String,
  },
  syllabusTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  syllabusInstitute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
  },
  chapters: [chapterSchema],
});

const Syllabus =
  mongoose.models.Syllabus || mongoose.model("Syllabus", syllabusSchema);

export default Syllabus;
