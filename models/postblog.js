import mongoose,{ Schema } from "mongoose";

const postSchema = new Schema(
    {
        report: String,
        email: String,
    },
    {

        timestamps: true

    }

)

const Post = mongoose.models.Postblog || mongoose.model("Postblog",postSchema);
export default Post;