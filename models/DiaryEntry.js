// models/DiaryEntry.js
import mongoose from 'mongoose';

const DiaryEntrySchema = new mongoose.Schema({
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  content: { type: String, required: true }, // Ensure you use 'content' here
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classSelected: { type: String, required: true },
  sectionSelected: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.models.DiaryEntry || mongoose.model('DiaryEntry', DiaryEntrySchema);
