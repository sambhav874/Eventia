
import { currentUser } from '@clerk/nextjs/server';

export default async function GET(req : any, res: any) {
  try {
    const user = await currentUser();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ error: 'Failed to get current user' });
  }
}