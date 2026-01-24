import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema({
    name: String,
    price: Number,
    duration: Number
})

const serviceProviderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['veterinarian', 'groomer', 'trainer'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: String,
    email: String,
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    services: [serviceSchema],
    discountPercent: {
        type: Number,
        default: 0
    },
    availableSlots: [String],
    image: String,
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.models.ServiceProvider || mongoose.model('ServiceProvider', serviceProviderSchema)
