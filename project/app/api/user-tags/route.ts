import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import UserTagInteraction from '@/models/UserInteraction';

export async function POST(req: NextRequest) {
  try {
    const { email, tagCounts } = await req.json();

    if (!email || !tagCounts) {
      return NextResponse.json({ message: "Email and tagCounts are required" }, { status: 400 });
    }

    await mongoose.connect(process.env.NEXT_MONGO_CLUSTER as string);

    let userTagInteraction = await UserTagInteraction.findOne({ userEmail: email });

    if (!userTagInteraction) {
      userTagInteraction = new UserTagInteraction({ userEmail: email });
    }

    
    Object.entries(tagCounts).forEach(([tag, count]) => {
      userTagInteraction.tagCounts.set(tag, (userTagInteraction.tagCounts.get(tag) || 0) + count);
    });

    userTagInteraction.lastUpdated = new Date();
    await userTagInteraction.save();

    return NextResponse.json({ message: "Tag counts updated successfully" }, { status: 200 });

  } catch (error) {
    console.error('Error updating tag counts:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}