import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import EventModel from '@/models/Event';
import OrganizerInfo from '@/models/OrganizerInfo';

export async function GET(req: NextRequest) {
  await mongoose.connect(process.env.NEXT_MONGO_CLUSTER as string);

  try {
    const searchParams = req.nextUrl.searchParams;
    const tag = searchParams.get('tag');
    const id = searchParams.get('id');
    const organizerRef = searchParams.get('organizerRef');

    let query: any = {};
    if (tag) {
      query.tags = tag;
    }
    if (id) {
      if (Array.isArray(id)) {
        query._id = { $in: id };
      } else {
        query._id = id;
      }
    }
    if (organizerRef) {
      query.creator = organizerRef;
    }

    
    const events = await EventModel.find(query);
    
    

    if (events.length === 0) {
      return NextResponse.json({ message: 'No events found' }, { status: 404 });
    }
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { message: 'Failed to fetch events', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await mongoose.connect(process.env.NEXT_MONGO_CLUSTER as string);

    const data = await req.json();
    console.log(data);
    console.log(data.creator);

    const event = new EventModel(data);
    await event.save();

    const updateResult = await OrganizerInfo.findOneAndUpdate(
      { organizerRef: data.creator },    
      {
        $push: { events: event._id }     
      },
      { new: true }                     
    );

    if (!updateResult) {
      console.log('No organizer found with the provided creator ID.');
      return NextResponse.json({ message: 'Organizer not found.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Event created successfully and organizer updated',
      event,
      organizer: {
        id: updateResult._id,
        organizerRef: updateResult.organizerRef,
        name: updateResult.name,
        events: updateResult.events
      }
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ message: 'Failed to create event', error: (error as Error).message }, { status: 500 });
  }
}