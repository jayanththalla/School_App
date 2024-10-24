// pages/api/notifications/[id].js
import dbConnect from '../../../lib/dbConnect';
import Notification from '../../../models/Notification';
import { authenticate } from '../../../middleware/auth'; // Assuming you have authentication middleware

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  // Authenticate user first (assuming `authenticate` middleware sets `req.user`)
  await authenticate(req, res, async () => {
    if (req.method === 'PUT') {
      if (!id) {
        return res.status(400).json({ success: false, message: 'Notification ID is required' });
      }

      try {
        const notification = await Notification.findById(id);

        if (!notification) {
          return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        // Ensure that only the owner of the notification can mark it as read
        if (String(notification.user) !== String(req.user._id)) {
          return res.status(403).json({ success: false, message: 'Unauthorized action' });
        }

        // Update the read status to true
        notification.read = true;
        await notification.save();

        res.status(200).json({ success: true, message: 'Notification marked as read', notification });
      } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ success: false, message: 'Server error' });
      }
    } else {
      res.setHeader('Allow', ['PUT']);
      res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }
  });
}
