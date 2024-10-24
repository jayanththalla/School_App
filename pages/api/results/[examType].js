import dbConnect from '../../../lib/dbConnect';
import Result from '../../../models/Result';

export default async function handler(req, res) {
  const { method } = req;
  const { examType } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const results = await Result.find({ examType });
        res.status(200).json(results);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching results' });
      }
      break;
    case 'POST':
      try {
        const result = await Result.create(req.body);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: 'Error creating result' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
