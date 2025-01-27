import { connectDB } from "@/lib/connectDB";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const newUser = await request.json();

  try {
    const db = await connectDB();
    const userCollection = db.collection("users");
    const recruiterCollection = db.collection("recruiter");

    const exist = await userCollection.findOne({ email: newUser.email });
    console.log("Existing User:", exist);

    if (exist) {
      return NextResponse.json({ message: "User Exists" }, { status: 409 });
    }

    const hashedPassword = bcrypt.hashSync(newUser.password, 14);

    const res = await userCollection.insertOne({
      ...newUser,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User Created" }, { status: 201 });
  } catch (error) {
    console.error("Error while creating user:", error);

    return NextResponse.json(
      { message: "Something Went Wrong", error: error.message },
      { status: 500 }
    );
  }
};
