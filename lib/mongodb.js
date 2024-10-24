import mongoose from 'mongoose';
import Project from "../models/projects"

let client = null;
let imgbucket = null;
let filebucket = null;
export async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });
    client = mongoose.connection;
    const db = mongoose.connection;
    imgbucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "images",
    });
    filebucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "files",
    });
    await Project.updateMany(
      { rathing: { $type: "int" } },
      [
        { $set: { rathing: { $toDouble: "$rathing" } } }
      ]
    );
    console.log("Connected to MongoDB");
    return { client, imgbucket, filebucket };
} catch (error) {
    console.error("Error connecting to MongoDB", error);
}

    }