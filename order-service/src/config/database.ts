import mongoose from "mongoose";

export async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected for Order Service");
  } catch (error) {
    console.error("MongoDB Connection Failed");
    console.error(error);
    process.exit(1);
  }
}