import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import EventModel from '@/models/Event';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tag = searchParams.get('tag');

  console.log('Received tag:', tag);

  try {
    if (!tag) {
      return NextResponse.json({ message: 'Tag parameter is required' }, { status: 400 });
    }

    // Ensure MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI as string);
      console.log('Connected to MongoDB');
    }

    console.log('Querying events...');
    const events = await EventModel.find({ tags: tag });
    console.log('Found events:', events.length);

    if (!events || events.length === 0) {
      return NextResponse.json({ message: 'No events found for this tag' }, { status: 404 });
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}