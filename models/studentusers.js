import mongoose,{ Schema } from "mongoose";

const Studentuserschema = new Schema(
    {
        name: String,
        email: String,
    },
    {

        timestamps: true

    }

)

const Studentusers = mongoose.models.Studentusers || mongoose.model("Studentusers",Studentuserschema);
export default Studentusers;