import mongoose from "mongoose";

export interface IUser {
    password: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
},
{ timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);