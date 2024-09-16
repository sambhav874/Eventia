
import { NextResponse } from 'next/server'

import User from '@/models/User'
import mongoose from 'mongoose'

export async function POST(request: Request) {
  try {
    
    await mongoose.connect(process.env.NEXT_MONGO_CLUSTER as string);
    const { email } = await request.json();
    
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ username: user.username , creator: user._id }, { status: 200 })
  } catch (error) {
    console.error('Error fetching username:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}