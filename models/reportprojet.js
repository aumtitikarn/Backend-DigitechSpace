import { timeStamp } from "console";
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

const Post = mongoose.models.Reportprojets || mongoose.model("Reportprojets",postSchema);
export default Post;