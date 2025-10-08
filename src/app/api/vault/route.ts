// app/api/vault/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Vault from "@/models/Vault";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-secret-key-change-this";

// Encrypt password
function encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

// Decrypt password
function decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        console.log("Connected to DB");

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { title, username, password, url, notes } = body;

        // Validate required fields
        if (!title || !username || !password) {
            return NextResponse.json(
                { success: false, message: "Title, username, and password are required" },
                { status: 400 }
            );
        }

        // Encrypt the password before saving
        const encryptedPassword = encrypt(password);

        const newItem = await Vault.create({
            userEmail: session.user.email,
            title,
            username,
            password: encryptedPassword,
            url: url || "",
            notes: notes || "",
        });

        // Decrypt password for response
        const itemWithDecryptedPassword = {
            _id: newItem._id,
            title: newItem.title,
            username: newItem.username,
            password: decrypt(newItem.password),
            url: newItem.url,
            notes: newItem.notes,
            createdAt: newItem.createdAt,
            updatedAt: newItem.updatedAt,
        };

        return NextResponse.json(
            { success: true, data: itemWithDecryptedPassword },
            { status: 201 }
        );
    } catch (error) {
        console.error("Vault POST error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const items = await Vault.find({ userEmail: session.user.email }).sort({ createdAt: -1 });

        // Decrypt passwords before sending
        const decryptedItems = items.map((item) => ({
            _id: item._id,
            title: item.title,
            username: item.username,
            password: decrypt(item.password),
            url: item.url,
            notes: item.notes,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));

        return NextResponse.json({ success: true, data: decryptedItems });
    } catch (error) {
        console.error("Vault GET error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID is required" },
                { status: 400 }
            );
        }

        const deletedItem = await Vault.findOneAndDelete({
            _id: id,
            userEmail: session.user.email,
        });

        if (!deletedItem) {
            return NextResponse.json(
                { success: false, message: "Item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Item deleted" });
    } catch (error) {
        console.error("Vault DELETE error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
};

// app/api/vault/route.ts
export async function PUT(req: NextRequest) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { id, title, username, password, url, notes } = body;

        // Validate ID
        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID is required" },
                { status: 400 }
            );
        }

        // Validate required fields
        if (!title || !username || !password) {
            return NextResponse.json(
                { success: false, message: "Title, username, and password are required" },
                { status: 400 }
            );
        }

        // Encrypt the password
        const encryptedPassword = encrypt(password);

        // Update the item
        const updatedItem = await Vault.findOneAndUpdate(
            { _id: id, userEmail: session.user.email },
            {
                title,
                username,
                password: encryptedPassword,
                url: url || "",
                notes: notes || "",
            },
            { new: true } // Return the updated document
        );

        if (!updatedItem) {
            return NextResponse.json(
                { success: false, message: "Item not found or unauthorized" },
                { status: 404 }
            );
        }

        // Decrypt password for response
        const itemWithDecryptedPassword = {
            _id: updatedItem._id.toString(),
            title: updatedItem.title,
            username: updatedItem.username,
            password: decrypt(updatedItem.password),
            url: updatedItem.url,
            notes: updatedItem.notes,
            createdAt: updatedItem.createdAt,
            updatedAt: updatedItem.updatedAt,
        };

        return NextResponse.json(
            { success: true, data: itemWithDecryptedPassword },
            { status: 200 }
        );
    } catch (error) {
        console.error("Vault PUT error:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
        );
    }
}