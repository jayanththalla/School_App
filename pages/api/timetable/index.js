import dbConnect from '../../../lib/dbConnect';
import Timetable from '../../../models/Timetable';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const timetables = await Timetable.find({});
    res.status(200).json(timetables);
  } else if (req.method === 'POST') {
    try {
      const timetableData = Array.isArray(req.body) ? req.body : [req.body];
      const newTimetables = await Timetable.insertMany(timetableData);
      res.status(201).json(newTimetables);
    } catch (error) {
      console.error('Error saving timetable:', error);
      res.status(500).json({ error: 'Failed to save timetable' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
