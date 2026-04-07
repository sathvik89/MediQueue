import mongoose from "mongoose";

// SINGLETON PATTERN
// Ensures only ONE Mongoose connection is created across the entire application.
// No matter how many files import this, they all share the same instance.
export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private isConnected: boolean = false;

  // Private constructor — prevents external instantiation with `new`
  private constructor() {}

  // Only way to get the instance
  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect(uri: string): Promise<void> {
    if (this.isConnected) {
      console.log("✅ Using existing MongoDB connection");
      return;
    }
    try {
      await mongoose.connect(uri);
      this.isConnected = true;
      console.log("✅ MongoDB connected successfully");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("🔌 MongoDB disconnected");
    }
  }
}
