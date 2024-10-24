// /models/ExamSchedule.js
import mongoose from 'mongoose';

const ExamScheduleSchema = new mongoose.Schema({
  examType: { type: String, required: true },
  subjects: { type: [String], required: true },
  dates: { type: [String], required: true },
  days: { type: [String], required: true },
}, { timestamps: true });

export default mongoose.models.ExamSchedule || mongoose.model('ExamSchedule', ExamScheduleSchema);
