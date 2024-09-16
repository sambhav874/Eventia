import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import EventModel from './../../../models/Event'; 

export async function POST(req: NextRequest) {
  
    try {
        await mongoose.connect(process.env.NEXT_MONGO_CLUSTER as string);

        const data = await req.json();
      console.log(data);
      const event = new EventModel(data);
      await event.save();

      return Response.json({ message: 'Event created successfully', event });
    } catch (error) {
      console.error('Error creating event:', error);
      return Response.json({ message: 'Failed to create event', error });
    }
  
  
};


export async function GET(req: NextRequest , res: NextResponse){
  try {
    await mongoose.connect(process.env.NEXT_MONGO_CLUSTER as string);
    const events = await EventModel.find();
    return NextResponse.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json({ message: 'Failed to fetch events', error });
      }
}
