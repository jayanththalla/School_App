// pages/api/auth/verifyOtp.js
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { email, otp } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      if (user.otp.code !== otp || user.otp.expiration < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      user.isVerified = true;
      user.otp = null;  // Clear OTP after verification
      await user.save();

      res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Only POST method is allowed' });
  }
}
