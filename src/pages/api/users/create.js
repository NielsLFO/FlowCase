import dbConnect from '../../../lib/db';
import User from '../../../models/User';

export default async function handler(req, res) {
    await dbConnect();  // Ensure the database is connected

    if (req.method === 'POST') {
        try {
            const { username, email, password } = req.body;
            const newUser = new User({ username, email, password });
            await newUser.save();
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
