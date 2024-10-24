// /pages/api/attendance/upload.js
import dbConnect from '../../../lib/dbConnect';
import Attendance from '../../../models/Attendance';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { teacherId, studentId, date, status } = req.body;

      const existingRecord = await Attendance.findOne({ studentId, date });
      if (existingRecord) {
        return res.status(400).json({ message: 'Attendance for this date already exists.' });
      }

      const newAttendance = new Attendance({
        teacherId,
        studentId,
        date,
        status,
      });

      await newAttendance.save();
      return res.status(201).json({ success: true, data: newAttendance });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
