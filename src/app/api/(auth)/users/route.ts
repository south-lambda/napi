import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export async function GET(): Promise<NextResponse> {
  try {
    await connect();

    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return new NextResponse("Error in fetching users" + err.message, {
        status: 500,
      });
    }

    return new NextResponse("Error in fetching users" + String(err), {
      status: 500,
    });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    await connect();

    const newUser = new User(body);
    await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: "User created", user: newUser }),
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof Error) {
      return new NextResponse("Error in creating user: " + err.message, {
        status: 500,
      });
    }
    return new NextResponse("Error in creating user: " + String(err), {
      status: 500,
    });
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { userId, newUsername }: { userId: string; newUsername: string } =
      body;

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "No id or username provided." }),
        {
          status: 400,
        },
      );
    }

    if (!ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user id" }), {
        status: 400,
      });
    }

    await connect();

    const updateUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true },
    );

    if (!updateUser) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 400,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "User is updated.", user: updateUser }),
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof Error) {
      return new NextResponse("Error in creating user: " + err.message, {
        status: 500,
      });
    }
    return new NextResponse("Error in creating user: " + String(err), {
      status: 500,
    });
  }
}
