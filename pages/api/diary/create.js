// /pages/api/diary/index.js
import dbConnect from '../../../lib/dbConnect';
import DiaryEntry from '../../../models/DiaryEntry';
import { authenticate, authorize } from '../../../middleware/auth';

export default async function handler(req, res) {
  await dbConnect(); // Ensure the database is connected

  if (req.method === 'POST') {
    try {
      // Authenticate and authorize the user (only 'teacher' can create diary entries)
      await authenticate(req, res, async () => {
        authorize(['teacher'])(req, res, async () => {
          const { subject, date, content, classSelected, sectionSelected } = req.body;

          // Validate inputs
          if (!subject || !date || !content || !classSelected || !sectionSelected) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
          }

          const teacherId = req.user._id; // Get the teacher ID from the authenticated user

          const newDiary = new DiaryEntry({
            subject,
            date,
            content,
            teacherId,
            classSelected,
            sectionSelected,
          });

          await newDiary.save();
          return res.status(201).json({ success: true, data: newDiary });
        });
      });
    } catch (error) {
      console.error('Error saving diary entry:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
