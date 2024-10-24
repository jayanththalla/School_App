// /pages/api/student/[id].js
import dbConnect from '../../../lib/dbConnect';
import Student from '../../../models/Student';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      // Fetch a student profile by ID
      try {
        const student = await Student.findById(id);
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
      break;

    case 'POST':
      // Create a new student profile
      try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json(newStudent);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
      break;

    case 'PUT':
      // Update an existing student profile
      try {
        const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedStudent) {
          return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(updatedStudent);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
      break;

    case 'DELETE':
      // Delete a student profile
      try {
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) {
          return res.status(404).json({ message: 'Student not found' });
        }
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
