import { connectMongoDB } from "../../../../lib/mongodb";
import Reportprojet from "../../../../models/reportprojet";
import { NextResponse } from "next/server";
import Order from "../../../../models/orders";
import Favorites from "../../../../models/favorites";
import Project from "../../../../models/projects";
import { ObjectId } from "mongodb"; // Ensure ObjectId is imported for MongoDB usage

export async function DELETE(req) {
  try {
    const { client, imgbucket, filebucket } = await connectMongoDB();
    
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ msg: "Missing projectId" }, { status: 400 });
    }

    const objectId = new ObjectId(projectId);

    const project = await Project.findOne({ _id: objectId });
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Deleting files from files bucket
    if (project.filesUrl && project.filesUrl.length > 0) {
      for (const fileName of project.filesUrl) {
        const file = await filebucket.find({ filename: fileName }).toArray();
        if (file.length > 0) {
          const fileId = file[0]._id;
          await filebucket.delete(fileId);
          await client.collection("files.chunks").deleteMany({ files_id: fileId });
        }
      }
    }

    // Deleting images from images bucket
    if (project.imageUrl && project.imageUrl.length > 0) {
      for (const imageName of project.imageUrl) {
        const image = await imgbucket.find({ filename: imageName }).toArray();
        if (image.length > 0) {
          const imageId = image[0]._id;
          await imgbucket.delete(imageId);
          await client.collection("images.chunks").deleteMany({ files_id: imageId });
        }
      }
    }

    // Deleting reports from Reportprojet
    const deletedReportprojet = await Reportprojet.deleteMany({ projectId });
    console.log("Deleted reports:", deletedReportprojet.deletedCount);

    // Updating orders to "delete"
    const updatedOrders = await Order.updateMany(
      { product: projectId },
      { $set: { status: "delete" } }
    );
    console.log("Updated orders to 'delete':", updatedOrders.modifiedCount);

    // Removing project from favorites
    const deletedFavorites = await Favorites.updateMany(
      {},
      { $pull: { projectId: projectId } }
    );
    console.log("Updated favorites:", deletedFavorites.modifiedCount);

    // Deleting the project itself
    const deletedProject = await Project.findOneAndDelete({ _id: objectId });
    if (!deletedProject) {
      return NextResponse.json({ msg: "Project not found in projects" }, { status: 404 });
    }

    console.log("Project and associated data deleted successfully");
    return NextResponse.json(
      { message: "Project and associated data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { msg: "Error deleting project and associated data", error: error.message },
      { status: 500 }
    );
  }
}
