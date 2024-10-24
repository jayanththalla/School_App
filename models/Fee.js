// models/fee.js
import mongoose from 'mongoose';

const FeeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  term: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['paid', 'due', 'overdue'], required: true },
  feeType: { type: String, enum: ['tuition', 'registration', 'examination', 'late', 're-admission', 'fine'], required: true },
});

export default mongoose.models.Fee || mongoose.model('Fee', FeeSchema);
