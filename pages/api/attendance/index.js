import dbConnect from '../../../lib/dbConnect';
import Attendance from '../../../models/Attendance';
import { authenticate, authorize } from '../../../middleware/auth';

export default async function handler(req, res) {
  await dbConnect();

  // Middleware for authentication and authorization
  await authenticate(req, res, async () => {
    if (req.method === 'GET') {
      const { studentId, date } = req.query;

      // Fetch attendance for a specific student on a specific date
      if (studentId && date) {
        try {
          const attendance = await Attendance.findOne({ studentId, date });
          return res.status(200).json(attendance);
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      }

      // Fetch all attendance records if no filters are applied
      try {
        const attendanceRecords = await Attendance.find({});
        return res.status(200).json(attendanceRecords);
      } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } else if (req.method === 'POST') {
      // Only teachers can create or update attendance records
      await authorize(['teacher'])(req, res, async () => {
        const { teacherId, studentId, date, status } = req.body;

        try {
          const existingRecord = await Attendance.findOne({ studentId, date });
          if (existingRecord) {
            // Update existing attendance record
            existingRecord.status = status;
            await existingRecord.save();
            return res.status(200).json({ success: true, data: existingRecord });
          } else {
            // Create new attendance record
            const newAttendance = new Attendance({ teacherId, studentId, date, status });
            await newAttendance.save();
            return res.status(201).json({ success: true, data: newAttendance });
          }
        } catch (error) {
          return res.status(500).json({ success: false, message: error.message });
        }
      });
    } else if (req.method === 'DELETE') {
      // Only teachers can delete attendance records
      await authorize(['teacher'])(req, res, async () => {
        const { studentId, date } = req.query;
        if (!studentId || !date) {
          return res.status(400).json({ error: 'Student ID and date are required' });
        }

        try {
          const deletedRecord = await Attendance.deleteOne({ studentId, date });
          if (deletedRecord.deletedCount === 0) {
            return res.status(404).json({ error: 'Record not found' });
          }
          return res.status(204).end(); // No Content
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
