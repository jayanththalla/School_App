import dbConnect from '../../lib/dbConnect';
import Fee from '../../models/Fee';
import Student from '../../models/Student';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const fees = await Fee.find({}).populate('studentId'); // Populating student details with fee details
        res.status(200).json({ success: true, data: fees });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'POST':
      try {
        const fee = await Fee.create(req.body);
        res.status(201).json({ success: true, data: fee });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
