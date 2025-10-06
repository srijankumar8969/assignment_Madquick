import mongoose from "mongoose";

const VaultSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }, // encrypted
    url: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

const Vault = mongoose.models.Vault || mongoose.model("Vault", VaultSchema);
export default Vault;