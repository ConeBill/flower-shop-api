const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: { type: String, default: "pendente" },
  totalValue: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
