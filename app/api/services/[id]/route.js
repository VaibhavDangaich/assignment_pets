import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import ServiceProvider from '@/models/ServiceProvider'

export async function GET(request, { params }) {
    try {
        await dbConnect()

        const { id } = await params
        const provider = await ServiceProvider.findById(id).lean()

        if (!provider) {
            return NextResponse.json(
                { error: 'Service provider not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(provider)
    } catch (error) {
        console.error('Error fetching service provider:', error)
        return NextResponse.json(
            { error: 'Failed to fetch service provider' },
            { status: 500 }
        )
    }
}
