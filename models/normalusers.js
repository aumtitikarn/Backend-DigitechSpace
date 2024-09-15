import mongoose,{ Schema } from "mongoose";

const NormalusersSchema = new Schema(
    {
        name: String,
        email: String,
    },
    {

        timestamps: true

    }

)

const Normalusers = mongoose.models.Normalusers || mongoose.model("Normalusers",NormalusersSchema);
export default Normalusers;