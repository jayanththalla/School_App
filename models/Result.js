import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  grade: { type: String, required: true },
  remarks: { type: String, required: true },
});

const ResultSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  examType: { type: String, required: true },
  subjects: [SubjectSchema],
});

const Result = mongoose.models.Result || mongoose.model('Result', ResultSchema);

export default Result;
