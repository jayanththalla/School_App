// /pages/api/students.js
import dbConnect from '../../lib/dbConnect'
import Student from '../../models/Student';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  const { class: classSelected, section } = req.query;

  switch (method) {
    case 'GET':
      // Fetch students by class and section
      try {
        const students = await Student.find({ class: classSelected, section });
        res.status(200).json(students);
      } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
