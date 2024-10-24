// pages/api/auth/login.js
import dbConnect  from '../../../lib/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user || !user.isVerified) {
        return res.status(400).json({ message: 'User not found or not verified' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },  // Include role in the token
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ token });
    } catch (error) {
      console.error('Login error:', error);  // Log error to server console
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Only POST method is allowed' });
  }
}
