const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("OrderItem", orderItemSchema);
