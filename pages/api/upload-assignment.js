import { createRouter } from 'next-connect';
import multer from 'multer';
import path from 'path';
import dbConnect from '../../lib/dbConnect';
import Assignment from '../../models/Assignment';
import mongoose from 'mongoose';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  }),
});

const apiRoute = createRouter({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.put(async (req, res) => {
  await dbConnect();

  const { assignmentId, studentId } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ error: 'Invalid student ID' });
  }

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const submission = {
      studentId: new mongoose.Types.ObjectId(studentId),
      file: file.filename,
      submittedAt: new Date(),
      fileSize: file.size,
      fileType: file.mimetype,
    };

    assignment.submissions.push(submission);
    assignment.status = 'submitted';
    await assignment.save();

    res.status(200).json({
      success: true,
      file: {
        name: file.filename,
        size: file.size,
        type: file.mimetype,
      },
    });
  } catch (error) {
    console.error('Error saving assignment:', error);
    res.status(500).json({ error: 'Error saving assignment', details: error.message });
  }
});

export default apiRoute.handler();

export const config = {
  api: {
    bodyParser: false,
  },
};