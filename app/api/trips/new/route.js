import trip from "../../../../models/trip";
import { connectToDB } from "../../../../utils/database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import { options } from "../../../api/auth/[...nextauth]/options"


export const POST = async (req) => {
    try {
      await connectToDB();
      const session = await getServerSession(options)
      const userId = session.user.id
      const { name, about, distance, startDate, endDate} = await req.json();
      const Trip = new trip({ name, about, distance, startDate, endDate, creator: userId});
      await Trip.save();
      return new NextResponse(JSON.stringify(Trip), { status: 200 });
    } catch (error) {
      
      console.error('Error:', error);
      return new NextResponse("Failed to post trip", { status: 500 });
    }
  };
  