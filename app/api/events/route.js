import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Event from '@/models/Event'

export async function GET(request) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')
        const limit = parseInt(searchParams.get('limit')) || 20

        let query = { isActive: true }
        if (type) {
            query.type = type
        }

        const events = await Event.find(query)
            .sort({ date: 1 })
            .limit(limit)
            .lean()

        return NextResponse.json(events)
    } catch (error) {
        console.error('Error fetching events:', error)
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        const data = await request.json()
        await dbConnect()

        const event = await Event.create(data)

        return NextResponse.json(event, { status: 201 })
    } catch (error) {
        console.error('Error creating event:', error)
        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        )
    }
}
