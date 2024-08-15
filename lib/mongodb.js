import mongoose from 'mongoose';

export const connectMongoDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB.");
  };
  