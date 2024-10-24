// pages/api/notifications.js
import dbConnect from '../../lib/dbConnect';
import Notification from '../../models/Notification'; 

export default async function handler(req, res) {
  await dbConnect();
  
  if (req.method === 'GET') {
    const { role } = req.query; // e.g., role=teacher
    try {
      const notifications = await Notification.find({});
      
      // Optionally filter based on role
      const filteredNotifications = role ? notifications.filter(notification => notification.role === role) : notifications;

      res.status(200).json(filteredNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Error fetching notifications' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

