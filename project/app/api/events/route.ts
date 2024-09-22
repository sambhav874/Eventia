import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import EventModel from '@/models/Event';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tag = searchParams.get('tag');
  console.log(tag);

  try {
    await mongoose.connect(process.env.NEXT_MONGO_CLUSTER as string);

    let query = {};
    if (tag) {
      query = { tags: tag };
    }

    const events = await EventModel.find(query);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ message: 'Failed to fetch events', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await mongoose.connect(process.env.NEXT_MONGO_CLUSTER as string);

    const data = await req.json();
    console.log(data);
    const event = new EventModel(data);
    await event.save();

    return NextResponse.json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ message: 'Failed to create event', error: (error as Error).message }, { status: 500 });
  }
}