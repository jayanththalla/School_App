import dbConnect from '../../../lib/dbConnect';
import Timetable from '../../../models/Timetable';

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === 'GET') {
    const timetable = await Timetable.findById(id);
    res.status(200).json(timetable);
  } else if (req.method === 'PUT') {
    const { section, day, time, subject } = req.body;
    const updatedTimetable = await Timetable.findByIdAndUpdate(id, { section, day, time, subject }, { new: true });
    res.status(200).json(updatedTimetable);
  } else if (req.method === 'DELETE') {
    await Timetable.findByIdAndDelete(id);
    res.status(204).end();
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
