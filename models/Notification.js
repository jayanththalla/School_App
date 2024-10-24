// models/notification.js
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  audience: { type: Object, required: true }, // This will hold the audience data structure
  attachment: { type: String }, // Store the file path or name if necessary
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  pushNotification: { type: Boolean, default: false },
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
