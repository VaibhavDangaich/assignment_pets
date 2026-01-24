import mongoose from 'mongoose'

const petSchema = new mongoose.Schema({
    name: String,
    type: String,
    breed: String
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    pets: [petSchema],
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.models.User || mongoose.model('User', userSchema)
