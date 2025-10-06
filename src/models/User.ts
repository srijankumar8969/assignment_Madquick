import mongoose from "mongoose";

export interface IUser {
    _id?: mongoose.Types.ObjectId;
    password: string;
    email: string;
    createdAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    _id: mongoose.Types.ObjectId,
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);