import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookingType: {
        type: String,
        enum: ['event', 'service'],
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    serviceProviderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider'
    },
    serviceName: String,
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    discountApplied: {
        type: Number,
        default: 0
    },
    finalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'confirmed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema)
