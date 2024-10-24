// pages/api/notifications/index.js
import dbConnect from '../../../lib/dbConnect';
import Notification from '../../../models/Notification';
import { authenticate } from '../../../middleware/auth';
import multer from 'multer';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { body, validationResult } from 'express-validator'; // You can use express-validator for input validation


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), 'uploads');
        // Create the uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG are allowed.'));
        }
    }
});

export const config = {
    api: {
        bodyParser: false,
    },
};
export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        // Authenticate user before allowing creation of notifications
        await authenticate(req, res, async () => {
            // Validate request body fields
            await body('title').notEmpty().withMessage('Title is required').run(req);
            await body('message').notEmpty().withMessage('Message is required').run(req);
            await body('audience').isArray().withMessage('Audience must be an array').run(req);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            try {
                const multerUpload = promisify(upload.single('attachment'));
                await multerUpload(req, res);

                const { title, type, audience, message, schedule } = req.body;

                if (!title || !type || !audience || !message) {
                    return res.status(400).json({ success: false, message: 'Missing required fields' });
                }

                const notificationData = {
                    title,
                    type,
                    audience: JSON.parse(audience),
                    message,
                    createdBy: req.user._id,
                };

                if (req.file) {
                    notificationData.attachment = req.file.path;
                }

                if (schedule) {
                    notificationData.schedule = new Date(schedule);
                }

                const notification = new Notification(notificationData);
                await notification.save();

                res.status(201).json({ success: true, notification });
            } catch (error) {
                console.error('Error creating notification:', error);
                if (error instanceof multer.MulterError) {
                    if (error.code === 'LIMIT_FILE_SIZE') {
                        return res.status(400).json({ success: false, message: 'File size exceeds 5MB limit.' });
                    }
                }
                res.status(500).json({ success: false, message: error.message || 'Server error' });
            }
        });
    } else if (req.method === 'GET') {
        await authenticate(req, res, async () => {
            try {
                // Fetch notifications filtered by user (example)
                const notifications = await Notification.find({
                    audience: req.user.role, // Only show notifications intended for the user's role
                });

                res.status(200).json({ success: true, notifications });
            } catch (error) {
                console.error('Error fetching notifications:', error);
                res.status(500).json({ success: false, message: 'Server error' });
            }
        });
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }
}
