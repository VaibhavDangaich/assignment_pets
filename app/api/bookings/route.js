import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Booking from '@/models/Booking'
import Event from '@/models/Event'
import User from '@/models/User'

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

        const bookings = await Booking.find({ userId: session.user.id })
            .populate('eventId')
            .populate('serviceProviderId')
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json(bookings)
    } catch (error) {
        console.error('Error fetching bookings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
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

        await dbConnect()

        const user = await User.findById(session.user.id)
        if (!user.isSubscribed) {
            return NextResponse.json(
                { error: 'Subscription required to make bookings' },
                { status: 403 }
            )
        }

        const data = await request.json()

        if (data.bookingType === 'event' && data.eventId) {
            const event = await Event.findById(data.eventId)
            if (!event) {
                return NextResponse.json(
                    { error: 'Event not found' },
                    { status: 404 }
                )
            }
            if (event.bookedSlots >= event.totalSlots) {
                return NextResponse.json(
                    { error: 'Event is fully booked' },
                    { status: 400 }
                )
            }
            await Event.findByIdAndUpdate(data.eventId, {
                $inc: { bookedSlots: 1 }
            })
        }

        const booking = await Booking.create({
            ...data,
            userId: session.user.id
        })

        return NextResponse.json(booking, { status: 201 })
    } catch (error) {
        console.error('Error creating booking:', error)
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        )
    }
}
