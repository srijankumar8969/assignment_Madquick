// models/Vault.ts
import mongoose, { Document } from "mongoose";

export interface VaultItem extends Document {
    userEmail: string;
    title: string;
    username: string;
    password: string;
    url?: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const VaultSchema = new mongoose.Schema(
    {
        userEmail: { type: String, required: true, index: true },
        title: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true }, // will be encrypted
        url: { type: String },
        notes: { type: String },
    },
    { timestamps: true }
);

const Vault = mongoose.models.Vault || mongoose.model<VaultItem>("Vault", VaultSchema);
export default Vault;