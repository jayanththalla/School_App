export default async function handler(req, res) {
  await dbConnect(); // Connect to the database

  const { examType } = req.query; // Get the exam type from the query

  if (req.method === 'GET') {
    try {
      const results = await Result.find({ examType }); // Fetch results by exam type
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching results' });
    }
  } else if (req.method === 'POST') {
    try {
      const newResult = new Result(req.body); // Create a new result
      await newResult.save();
      res.status(201).json(newResult);
    } catch (error) {
      res.status(400).json({ error: 'Error creating result' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.body; // Expecting the ID of the result to update
      const updatedResult = await Result.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updatedResult);
    } catch (error) {
      res.status(400).json({ error: 'Error updating result' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body; // Expecting the ID of the result to delete
      await Result.findByIdAndDelete(id);
      res.status(204).json({});
    } catch (error) {
      res.status(400).json({ error: 'Error deleting result' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}