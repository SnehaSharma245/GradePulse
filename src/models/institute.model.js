// To be modified later

import mongoose , { Schema } from "mongoose";

const instituteSchema = new Schema({
    instituteName: {
        type: String,
        required: true,
        trim: true,
    },
    instituteCode: {
        type: String,
        trim: true,
    },
    instituteAddress: {
        type: String,
        trim: true,
    },
    institutePhone: {
        type: String,
        trim: true,
    },
    instituteEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    instituteWebsite: {
        type: String,
        trim: true,
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    teachers: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    courses: [{
        type: Schema.Types.ObjectId,
        ref: "Course",
    }]
});

const Institute = mongoose.models.Institute || mongoose.model("Institute", instituteSchema);

export default Institute;

