// models/Assignment.js
import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true }, // Add student name for easier reference
  file: { type: String }, // File submitted by the student
  submittedAt: { type: Date, default: Date.now }, // Submission time
  status: { type: String, default: 'pending' }, // Status can be 'pending', 'submitted', or 'graded'
  awardedMarks: { type: Number, default: 0 }, // Marks awarded to the student
}, { _id: false }); // _id is false to prevent creating a new id for each submission

const AssignmentSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  marks: { type: Number, required: true }, // Total marks available for the assignment
  startDate: { type: Date, required: true, default: Date.now }, // Start date of the assignment
  dueDate: { type: Date, required: true }, // Due date for the assignment submission
  class: { type: String, required: true }, // Class for which the assignment is assigned
  section: { type: String, required: true }, // Section of the class
  status: { type: String, default: 'pending' }, // Status of the assignment ('pending', 'submitted', 'graded')
  file: { type: String }, // Any file attached to the assignment by the teacher
  submissions: [SubmissionSchema], // Embedded submissions schema to track student submissions
}, { timestamps: true });

export default mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
