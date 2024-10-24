// /pages/api/exam/index.js
import dbConnect from '../../../lib/dbConnect';
import ExamSchedule from '../../../models/ExamSchedule';

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
    
    case 'POST': // Create a new exam schedule
      try {
        const schedule = await ExamSchedule.create(req.body); 
        res.status(201).json({ success: true, data: schedule });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
