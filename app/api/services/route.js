import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import ServiceProvider from '@/models/ServiceProvider'

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

        const providers = await ServiceProvider.find(query)
            .sort({ rating: -1 })
            .limit(limit)
            .lean()

        return NextResponse.json(providers)
    } catch (error) {
        console.error('Error fetching service providers:', error)
        return NextResponse.json(
            { error: 'Failed to fetch service providers' },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        const data = await request.json()
        await dbConnect()

        const provider = await ServiceProvider.create(data)

        return NextResponse.json(provider, { status: 201 })
    } catch (error) {
        console.error('Error creating service provider:', error)
        return NextResponse.json(
            { error: 'Failed to create service provider' },
            { status: 500 }
        )
    }
}
