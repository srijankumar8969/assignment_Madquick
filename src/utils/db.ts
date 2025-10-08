import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("❌ Please define the MONGODB_URI environment variable.");
}

interface CachedConnection {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

interface CustomGlobal extends Global {
    mongoose?: CachedConnection;
}

const cached: CachedConnection = ((global as CustomGlobal).mongoose || { conn: null, promise: null });

export default async function connectToDatabase() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    (global as CustomGlobal).mongoose = cached;

    return cached.conn;
}