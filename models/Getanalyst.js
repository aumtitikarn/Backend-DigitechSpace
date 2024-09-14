import mongoose from 'mongoose'; // Import mongoose

const normalUserSchema = new mongoose.Schema({
    name: String,
    roleai: String,
});

const studentUserSchema = new mongoose.Schema({
    name: String,
    roleai: String,
});

const NormalUser = mongoose.model('NormalUser', normalUserSchema);
const StudentUser = mongoose.model('StudentUser', studentUserSchema);

const getRoleData = async () => {
    try {
      const normalUsers = await NormalUser.find({}, 'roleai');
      const studentUsers = await StudentUser.find({}, 'roleai');
  
      return { normalUsers, studentUsers };
    } catch (err) {
      console.error(err);
    }
  };