import { dbConnect } from '../../lib/dbConnect';
import User from '../../models/User';
import Notification from '../../models/Notification'; // Example model for notifications
import Fee from '../../models/Fee'; // Example model for fee details
import Attendance from '../../models/Attendance'; // Example model for attendance

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const userId = req.query.userId;

      // Fetch user data
      const user = await User.findById(userId);
      
      // Fetch related data
      const notifications = await Notification.find({ userId });
      const feeDetails = await Fee.find({ userId });
      const attendance = await Attendance.find({ userId });

      res.status(200).json({
        user,
        notifications,
        feeDetails,
        attendance
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  } else {
    res.status(405).json({ message: 'Only GET method is allowed' });
  }
}
