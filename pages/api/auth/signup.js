// pages/api/auth/signup.js
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { generateOtp } from '../../../lib/generateOtp';
import { sendEmail } from '../../../lib/sendEmail';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { email, password, role } = req.body; // Receive role from the request body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const otpCode = generateOtp();

      const newUser = new User({
        email,
        password: hashedPassword,
        role,  // Assign role from request body (admin, teacher, or student)
        otp: {
          code: otpCode,
          expiration: new Date(Date.now() + 10 * 60000), // 10 minutes expiration
        },
      });

      await newUser.save();
      await sendEmail({
        to: email,
        subject: 'Verify Your Email',
        text: `Your OTP code is ${otpCode}`,
      });

      res.status(201).json({ message: 'User created. Please verify your email.' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Only POST method is allowed' });
  }
}
