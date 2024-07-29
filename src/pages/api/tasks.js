import { db, auth } from '../../../firebase';
import { getAuth } from 'firebase-admin/auth';
import { Timestamp } from 'firebase/firestore';

export default async function handler(req, res) {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (req.method === 'GET') {
      const tasksCollection = db.collection('users').doc(userId).collection('tasks');
      const tasksSnapshot = await tasksCollection.get();
      const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(tasks);
    } else if (req.method === 'POST') {
      const { task, status, priority, description } = req.body;
      const tasksCollection = db.collection('users').doc(userId).collection('tasks');
      const newTask = await tasksCollection.add({ name: task, status, priority, description, createdAt: Timestamp.now() });
      res.status(201).json({ id: newTask.id, name: task, status, priority, description, createdAt: Timestamp.now() });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
