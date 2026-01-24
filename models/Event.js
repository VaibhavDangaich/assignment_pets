import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['training', 'adoption', 'meetup', 'competition'],
        required: true
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider'
    },
    providerName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPercent: {
        type: Number,
        default: 0
    },
    totalSlots: {
        type: Number,
        required: true
    },
    bookedSlots: {
        type: Number,
        default: 0
    },
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

export default mongoose.models.Event || mongoose.model('Event', eventSchema)
