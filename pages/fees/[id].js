import dbConnect from '../../lib/dbConnect';
import Fee from '../../models/Fee';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const fee = await Fee.findById(id).populate('studentId');
        if (!fee) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: fee });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'PUT':
      try {
        const fee = await Fee.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!fee) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: fee });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
