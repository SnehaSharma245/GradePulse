// To be modified later

import mongoose , { Schema } from "mongoose";

const studentSchema = new Schema({
    studentName: {
        type: String,
        required: true,
        trim: true,
    },
    studentEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },  


});

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;