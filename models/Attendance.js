// models/Attendance.js
import { Schema, model, models } from 'mongoose';

// Define the Attendance Schema
const attendanceSchema = new Schema({
  teacherId: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    unique: true, // Ensures no duplicate entries for the same student on the same date
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'publicHoliday', 'notTracked'], // Allowed status values
    required: true,
  },
});

// Prevents model re-compilation in development
const Attendance = models.Attendance || model('Attendance', attendanceSchema);

export default Attendance;
