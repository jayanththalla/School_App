// /pages/exams/index.js
import dbConnect from '../../lib/dbConnect';
import ExamSchedule from '../../models/ExamSchedule';

export default async function handler(req, res) {
  const { method } = req;
  
  await dbConnect();

  switch (method) {
    case 'GET': // Fetch all exam schedules
      try {
        const schedules = await ExamSchedule.find({});
        res.status(200).json({ success: true, data: schedules });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    
    default:
      res.status(400).json({ success: false });
      break;
  }
}
