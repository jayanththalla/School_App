// pages/api/mocktests/index.js
import dbConnect from '../../../lib/dbConnect';
import MockTest from '../../../models/MockTest';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET': // Fetch all mock tests with pagination
      const { page = 1, limit = 10 } = req.query; // Default to 1st page, 10 items per page
      try {
        const mockTests = await MockTest.find()
          .limit(limit * 1)
          .skip((page - 1) * limit);
        const total = await MockTest.countDocuments();

        res.status(200).json({
          success: true,
          data: mockTests,
          totalPages: Math.ceil(total / limit),
          currentPage: page
        });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
      break;


    case 'POST': // Create a new mock test
      try {
        const newTest = new MockTest(req.body);
        await newTest.save();
        res.status(201).json({ success: true, data: newTest });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
