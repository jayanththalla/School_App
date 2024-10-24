// /pages/api/diary/[date].js
import dbConnect from '../../../lib/dbConnect';
import DiaryEntry from '../../../models/DiaryEntry';
import { authenticate, authorize } from '../../../middleware/auth';

export default async function handler(req, res) {
  await dbConnect(); // Ensure the database is connected
  const { method } = req;
  const { date } = req.query;

  if (method === 'GET') {
    try {
      // Authenticate and authorize the user (allow 'teacher' or 'student')
      await authenticate(req, res, async () => {
        authorize(['teacher', 'student'])(req, res, async () => {
          const entries = await DiaryEntry.find({ date });

          if (!entries || entries.length === 0) {
            return res.status(404).json({ success: false, message: 'No entries found for this date' });
          }

          res.status(200).json({ success: true, data: entries });
        });
      });
    } catch (error) {
      console.error('Error fetching diary entries:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
  }
}
