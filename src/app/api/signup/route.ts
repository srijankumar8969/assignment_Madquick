import { IUser } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/utils/db";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = <IUser>(await request.json());
        console.log("Received signup data:", { email, password });
        await connectToDatabase().then(() => console.log("Connected to DB"));

        const existingUser = await User.findOne({ email });
        console.log(existingUser)
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({ email, password: passwordHash });
        console.log("Created new user:", newUser);
        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error during signup:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}