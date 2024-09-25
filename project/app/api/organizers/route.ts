import OrganizerInfo from "@/models/OrganizerInfo";

import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Ensure mongoose is connected only if it's not already
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_CLUSTER as string);
    }

    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    

    if (!id) {
      return NextResponse.json({ message: "Organizer ID is missing" }, { status: 400 });
    }

   
    const organizer = await OrganizerInfo.find({organizerRef : id });
    
    if (!organizer) {
      return NextResponse.json({ message: "Organizer not found" }, { status: 404 });
    }

    return NextResponse.json(organizer);
  } catch (error) {
    console.error("Error fetching organizer:", error);
    return NextResponse.json(
      { message: "Failed to fetch organizer", error: (error as Error).message },
      { status: 500 }
    );
  }
}