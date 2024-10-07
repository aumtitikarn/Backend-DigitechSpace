import mongoose from 'mongoose'; 

const normalUserSchema = new mongoose.Schema({
    name: String,
    roleai: String,
    createdAt: {
        type: Date,
      },
});


const NormalUser = mongoose.models.NormalUser || mongoose.model('NormalUser', normalUserSchema);
export default NormalUser;