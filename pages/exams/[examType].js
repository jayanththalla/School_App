// pages/exams/[examType].js
import dbConnect from '../../lib/dbConnect';
import ExamSchedule from '../../models/ExamSchedule';

export default async function handler(req, res) {
  const { method } = req;
  const { examType } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET': // Get specific exam schedule
      try {
        const schedule = await ExamSchedule.findOne({ examType });
        if (!schedule) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: schedule });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    
    case 'PUT': // Update specific exam schedule
      try {
        const schedule = await ExamSchedule.findOneAndUpdate({ examType }, req.body, {
          new: true,
          runValidators: true,
        });
        if (!schedule) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: schedule });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    
    case 'DELETE': // Delete specific exam schedule
      try {
        const deletedSchedule = await ExamSchedule.deleteOne({ examType });
        if (!deletedSchedule) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
