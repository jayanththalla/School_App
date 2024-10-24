// pages/api/assignments/index.js
import dbConnect from '../../../lib/dbConnect';
import Assignment from '../../../models/Assignment';
import { authenticate, authorize } from '../../../middleware/auth';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    // All roles can view assignments
    await authenticate(req, res, async () => {
      try {
        const assignments = await Assignment.find({});
        res.status(200).json(assignments);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error while fetching assignments' });
      }
    });
  } else if (req.method === 'POST') {
    // Only teachers and admins can create assignments
    await authenticate(req, res, async () => {
      await authorize(['teacher', 'admin'])(req, res, async () => {
        try {
          const { subject, title, description, marks, dueDate, class: className, section } = req.body;

          if (!subject || !title || !description || !marks || !dueDate || !className || !section) {
            return res.status(400).json({ error: 'All fields are required' });
          }

          const newAssignment = new Assignment({
            subject,
            title,
            description,
            marks,
            dueDate,
            class: className,
            section,
          });

          await newAssignment.save();
          res.status(201).json({ success: true, assignment: newAssignment });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error creating the assignment' });
        }
      });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
