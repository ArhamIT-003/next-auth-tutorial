import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userData = body.obj;

    console.log(body);

    if (
      !userData?.email ||
      !userData?.password ||
      !userData?.role ||
      !userData?.name
    ) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 400 }
      );
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashPassword;

    await User.create(userData);

    return NextResponse.json({ message: "User Created!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
