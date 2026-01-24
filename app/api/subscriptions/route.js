import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Subscription from '@/models/Subscription'
import User from '@/models/User'

const PLANS = {
    monthly: { price: 9.99, days: 30 },
    yearly: { price: 99.99, days: 365 }
}

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await dbConnect()

        const subscription = await Subscription.findOne({
            userId: session.user.id,
            isActive: true
        }).lean()

        return NextResponse.json({ subscription, plans: PLANS })
    } catch (error) {
        console.error('Error fetching subscription:', error)
        return NextResponse.json(
            { error: 'Failed to fetch subscription' },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { plan } = await request.json()

        if (!PLANS[plan]) {
            return NextResponse.json(
                { error: 'Invalid plan' },
                { status: 400 }
            )
        }

        await dbConnect()

        await Subscription.updateMany(
            { userId: session.user.id },
            { isActive: false }
        )

        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + PLANS[plan].days)

        const subscription = await Subscription.create({
            userId: session.user.id,
            plan,
            price: PLANS[plan].price,
            startDate,
            endDate,
            isActive: true,
            paymentStatus: 'completed'
        })

        await User.findByIdAndUpdate(session.user.id, {
            isSubscribed: true,
            subscriptionId: subscription._id
        })

        return NextResponse.json({
            message: 'Subscription activated successfully',
            subscription
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating subscription:', error)
        return NextResponse.json(
            { error: 'Failed to create subscription' },
            { status: 500 }
        )
    }
}
