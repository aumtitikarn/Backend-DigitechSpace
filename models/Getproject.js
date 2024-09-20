import mongoose from 'mongoose';


// Check if the Order model is already compiled, if not, define it
const projects = mongoose.models.projects || mongoose.model('projects', new mongoose.Schema({
    imageUrl: Array,
    projectname: String,
    description: String,
    price: Number,
    author: String,
    email: String,
    receive: Array,
    category: String,
    filesUrl: Array,
    status: String,
  }));

  export { projects };