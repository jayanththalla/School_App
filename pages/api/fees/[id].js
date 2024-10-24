// pages/api/fees/[id].js
import dbConnect from '../../../lib/dbConnect';
import Fee from '../../../models/Fee';
import { authenticate, authorize } from '../../../middleware/auth';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const fee = await Fee.findById(id);
        if (!fee) {
          return res.status(404).json({ success: false, message: 'Fee not found' });
        }
        res.status(200).json({ success: true, data: fee });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}


