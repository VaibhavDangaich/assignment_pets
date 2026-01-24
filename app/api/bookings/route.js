import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Booking from '@/models/Booking'
import Event from '@/models/Event'

export async function GET(request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await dbConnect()

        const bookings = await Booking.find({ userId })
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
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await dbConnect()

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
            userId
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
