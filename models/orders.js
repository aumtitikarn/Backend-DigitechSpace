import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    // Reference to the product (project)
    product:{ type: String, required: true }, 
    
    // Example of additional fields
    email: { type: String, required: true },   // Customer email
    amount: { type: Number, required: true },  // Amount paid
    net: { type: Number },                     // Net amount after service fee
    servicefee: { type: Number },              // Service fee
    typec: { type: String, default: "credit_card" }, // Payment type
    chargeId: { type: String },                // External payment service ID
    status: { type: String, default: "pending" },    // Payment status (e.g., successful, pending)
    createdAt: { type: Date, default: Date.now }     // Order creation time
});

// Export the model, check if already defined or create a new one
export default mongoose.models.Order || mongoose.model("Order", orderSchema);
