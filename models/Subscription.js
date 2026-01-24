import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    plan: {
        type: String,
        enum: ['monthly', 'yearly'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema)
