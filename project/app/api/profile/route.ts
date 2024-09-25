import OrganizerInfo from "@/models/OrganizerInfo";
import User from "@/models/User";
import UserInfo from "@/models/UserInfo";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    await mongoose.connect(process.env.NEXT_MONGO_CLUSTER as string);

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userInfo = await UserInfo.findOne({ userRef: user._id });
    const organizerInfo = await OrganizerInfo.findOne({ organizerRef: user._id });

    return NextResponse.json({ user, userInfo, organizerInfo }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await mongoose.connect(process.env.NEXT_MONGO_CLUSTER as string);
    const { email, updates, userType } = await req.json();

    if (!email || !updates || !userType) {
      return NextResponse.json({ message: "Email, updates, and userType are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let result;

    if (userType === 'organizer') {
      result = await OrganizerInfo.findOneAndUpdate(
        { organizerRef: user._id },
        { $set: { ...updates, organizerRef: user._id } },
        { new: true, upsert: true }
      );
    } else if (userType === 'user') {
      result = await UserInfo.findOneAndUpdate(
        { userRef: user._id },
        { $set: { ...updates, userRef: user._id } },
        { new: true, upsert: true }
      );
    } else {
      return NextResponse.json({ message: "Invalid userType" }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json({ message: `${userType} not found` }, { status: 404 });
    }

    return NextResponse.json({ message: `${userType} profile updated successfully`, data: result }, { status: 200 });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}