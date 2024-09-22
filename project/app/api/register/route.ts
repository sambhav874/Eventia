import User from '@/models/User';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await mongoose.connect(process.env.NEXT_MONGO_CLUSTER as string);
    const data = await req.json();
    const { username, email, name , phoneNumber, userType } = data;

    if (!username || !email || !phoneNumber || !userType) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    console.log(data); 

    const user = await User.create({
      name ,
        username,
        email,
        phoneNumber,
        userType
    });

    return NextResponse.json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}