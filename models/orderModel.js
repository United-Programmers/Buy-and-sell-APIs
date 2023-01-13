const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: {
        type: Array,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingAddress: {
        type: String,
        required: true
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    deliveryType: {
        type: String,
        enum: ['door', 'pickup'],
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    status: {
        type: String,
        default: 'Not Processed',
        enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    },
    assignedTo: {
        type: mongoose.Types.ObjectId,
        ref: 'Driver'
    }
}, {
    timestamps: true
})


const OrderModel = mongoose.model("Order", orderSchema);
module.exports = OrderModel