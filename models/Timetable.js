//models/timetable.js
import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  section: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  subject: { type: String, required: true },
});

export default mongoose.models.Timetable || mongoose.model('Timetable', timetableSchema);
