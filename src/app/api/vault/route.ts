import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Vault  from "@/models/Vault";
import { authOptions } from "../[...nextauth]/route";
import { getServerSession } from "next-auth";
export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const newItem = await Vault.create({
        ...body,
        userEmail: session.user.email,
        });

        return NextResponse.json({ success: true, data: newItem });
    } catch (error) {
        console.error("Vault POST error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const items = await Vault.find({ userEmail: session.user.email });
        return NextResponse.json({ success: true, data: items });
    } catch (error) {
        console.error("Vault GET error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
