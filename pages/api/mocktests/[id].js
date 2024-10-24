// pages/api/mocktests/[id].js
import dbConnect from '../../../lib/dbConnect';
import MockTest from '../../../models/MockTest';

export default async function handler(req, res) {
  const { id } = req.query;
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const test = await MockTest.findById(id);
        if (!test) {
          return res.status(404).json({ success: false, message: 'Mock test not found' });
        }
        res.status(200).json({ success: true, data: test });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
      break;

    case 'PUT': // Edit a mock test
      try {
        const updatedTest = await MockTest.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedTest) {
          return res.status(404).json({ success: false, message: 'Mock test not found' });
        }
        res.status(200).json({ success: true, data: updatedTest });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case 'DELETE': // Delete a mock test
      try {
        const deletedTest = await MockTest.findByIdAndDelete(id);
        if (!deletedTest) {
          return res.status(404).json({ success: false, message: 'Mock test not found' });
        }
        res.status(200).json({ success: true, message: 'Mock test deleted successfully' });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
