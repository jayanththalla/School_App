// pages/api/admin/protected-route.js
import { roleAuth } from '../../../middleware/roleAuth';

export default async function handler(req, res) {
  roleAuth(['admin'])(req, res, async () => {
    // Only accessible by admins
    res.status(200).json({ message: 'Welcome Admin!' });
  });
}
