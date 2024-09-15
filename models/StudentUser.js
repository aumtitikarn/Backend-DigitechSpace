import mongoose from 'mongoose'; 

const studentUserSchema = new mongoose.Schema({
    name: String,
    roleai: String,
});


const StudentUser = mongoose.models.StudentUser || mongoose.model('StudentUser', studentUserSchema);
export default StudentUser;