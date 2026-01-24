import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Import the actual models
import User from '../models/User.js'
import Event from '../models/Event.js'
import ServiceProvider from '../models/ServiceProvider.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-events'

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('Connected to MongoDB')

        await User.deleteMany({})
        await Event.deleteMany({})
        await ServiceProvider.deleteMany({})
        console.log('Cleared existing data')

        const hashedPassword = await bcrypt.hash('password123', 12)

        const users = await User.insertMany([
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: hashedPassword,
                phone: '+1 234 567 8900',
                pets: [
                    { name: 'Max', type: 'Dog', breed: 'Golden Retriever' },
                    { name: 'Whiskers', type: 'Cat', breed: 'Persian' }
                ],
                isSubscribed: true
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: hashedPassword,
                phone: '+1 234 567 8901',
                pets: [
                    { name: 'Buddy', type: 'Dog', breed: 'Labrador' }
                ],
                isSubscribed: false
            }
        ])
        console.log('Created users')

        const events = await Event.insertMany([
            {
                title: 'Basic Obedience Training Camp',
                description: 'A comprehensive 3-day training camp for puppies and adult dogs. Learn essential commands, leash training, and socialization skills with our certified trainers.',
                type: 'training',
                providerName: 'PawPerfect Training Academy',
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                time: '9:00 AM - 4:00 PM',
                location: 'Central Park Dog Zone, New York',
                price: 150,
                discountPercent: 20,
                totalSlots: 15,
                bookedSlots: 8,
                isActive: true
            },
            {
                title: 'Weekend Pet Adoption Drive',
                description: 'Find your new furry family member! Over 50 cats and dogs looking for loving homes. Adoption fees include vaccinations and microchipping.',
                type: 'adoption',
                providerName: 'Happy Tails Rescue',
                date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                time: '10:00 AM - 5:00 PM',
                location: 'Community Center, Brooklyn',
                price: 0,
                discountPercent: 0,
                totalSlots: 100,
                bookedSlots: 45,
                isActive: true
            },
            {
                title: 'Dog Park Social Meetup',
                description: 'Monthly meetup for dog owners! Let your pups play and socialize while you connect with fellow pet parents. Snacks and refreshments provided.',
                type: 'meetup',
                providerName: 'NYC Dog Lovers Club',
                date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                time: '3:00 PM - 6:00 PM',
                location: 'Prospect Park, Brooklyn',
                price: 15,
                discountPercent: 15,
                totalSlots: 50,
                bookedSlots: 32,
                isActive: true
            },
            {
                title: 'Annual Pet Talent Show',
                description: 'Show off your pet amazing tricks! Categories include Best Trick, Most Obedient, and Most Adorable. Great prizes for winners!',
                type: 'competition',
                providerName: 'PetStar Entertainment',
                date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                time: '11:00 AM - 3:00 PM',
                location: 'Madison Square Garden, Manhattan',
                price: 50,
                discountPercent: 25,
                totalSlots: 30,
                bookedSlots: 12,
                isActive: true
            },
            {
                title: 'Advanced Agility Training',
                description: 'Take your training to the next level! Learn professional agility course techniques with our expert trainers.',
                type: 'training',
                providerName: 'Elite K9 Academy',
                date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                time: '8:00 AM - 12:00 PM',
                location: 'Sports Complex, Queens',
                price: 200,
                discountPercent: 10,
                totalSlots: 10,
                bookedSlots: 7,
                isActive: true
            },
            {
                title: 'Cat Cafe Adoption Event',
                description: 'Spend time with adorable cats while enjoying coffee and pastries. All cats available for adoption.',
                type: 'adoption',
                providerName: 'Meow Manor Rescue',
                date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
                time: '1:00 PM - 7:00 PM',
                location: 'Whiskers Cafe, Manhattan',
                price: 10,
                discountPercent: 0,
                totalSlots: 40,
                bookedSlots: 22,
                isActive: true
            }
        ])
        console.log('Created events')

        const serviceProviders = await ServiceProvider.insertMany([
            {
                name: 'Dr. Sarah Johnson',
                type: 'veterinarian',
                description: 'Board-certified veterinarian with 15 years of experience. Specializing in general wellness, vaccinations, and emergency care for dogs and cats.',
                address: '123 Pet Care Lane, Manhattan, NY 10001',
                phone: '+1 212 555 0101',
                email: 'dr.johnson@petcare.com',
                rating: 4.9,
                services: [
                    { name: 'General Checkup', price: 75, duration: 30 },
                    { name: 'Vaccination Package', price: 120, duration: 45 },
                    { name: 'Dental Cleaning', price: 200, duration: 60 },
                    { name: 'X-Ray & Diagnostics', price: 150, duration: 45 }
                ],
                discountPercent: 15,
                isActive: true
            },
            {
                name: 'Pampered Paws Grooming',
                type: 'groomer',
                description: 'Full-service pet grooming salon offering bathing, haircuts, nail trimming, and spa treatments. Using only premium organic products.',
                address: '456 Style Street, Brooklyn, NY 11201',
                phone: '+1 718 555 0202',
                email: 'hello@pamperedpaws.com',
                rating: 4.7,
                services: [
                    { name: 'Basic Bath & Brush', price: 45, duration: 45 },
                    { name: 'Full Grooming Package', price: 85, duration: 90 },
                    { name: 'Nail Trim & Filing', price: 20, duration: 15 },
                    { name: 'De-shedding Treatment', price: 65, duration: 60 }
                ],
                discountPercent: 20,
                isActive: true
            },
            {
                name: 'Mike Professional Dog Training',
                type: 'trainer',
                description: 'Certified professional dog trainer with a positive reinforcement approach. Private and group sessions available for puppies and adult dogs.',
                address: '789 Training Blvd, Queens, NY 11375',
                phone: '+1 347 555 0303',
                email: 'mike@dogtraining.com',
                rating: 4.8,
                services: [
                    { name: 'Private Training Session', price: 100, duration: 60 },
                    { name: 'Group Classes (4 weeks)', price: 250, duration: 60 },
                    { name: 'Puppy Basics Package', price: 350, duration: 90 },
                    { name: 'Behavioral Consultation', price: 150, duration: 90 }
                ],
                discountPercent: 10,
                isActive: true
            },
            {
                name: 'VetCare 24/7 Hospital',
                type: 'veterinarian',
                description: 'State-of-the-art emergency veterinary hospital open 24/7. Equipped with advanced diagnostic equipment and experienced emergency vets.',
                address: '321 Emergency Ave, Manhattan, NY 10016',
                phone: '+1 212 555 0404',
                email: 'emergency@vetcare247.com',
                rating: 4.6,
                services: [
                    { name: 'Emergency Consultation', price: 150, duration: 30 },
                    { name: 'Surgery Consultation', price: 200, duration: 45 },
                    { name: 'Overnight Monitoring', price: 300, duration: 720 },
                    { name: 'Lab Work & Testing', price: 175, duration: 30 }
                ],
                discountPercent: 5,
                isActive: true
            },
            {
                name: 'Fluffy Cuts Mobile Grooming',
                type: 'groomer',
                description: 'Convenience meets quality! Our mobile grooming van comes to your doorstep. Perfect for pets who get anxious at salons.',
                address: 'Mobile Service - All NYC Areas',
                phone: '+1 646 555 0505',
                email: 'book@fluffycuts.com',
                rating: 4.5,
                services: [
                    { name: 'Mobile Basic Groom', price: 75, duration: 60 },
                    { name: 'Mobile Full Service', price: 120, duration: 90 },
                    { name: 'Cat Grooming Special', price: 95, duration: 75 },
                    { name: 'Teeth Brushing Add-on', price: 15, duration: 10 }
                ],
                discountPercent: 15,
                isActive: true
            },
            {
                name: 'Canine Academy Elite',
                type: 'trainer',
                description: 'Premium dog training for show dogs and competitive obedience. Our trainers have won national championships and trained celebrity pets.',
                address: '555 Champion Way, Long Island, NY 11530',
                phone: '+1 516 555 0606',
                email: 'elite@canineacademy.com',
                rating: 4.9,
                services: [
                    { name: 'Show Dog Preparation', price: 300, duration: 120 },
                    { name: 'Competition Obedience', price: 250, duration: 90 },
                    { name: 'Board & Train (2 weeks)', price: 2500, duration: 0 },
                    { name: 'Private VIP Session', price: 200, duration: 90 }
                ],
                discountPercent: 12,
                isActive: true
            }
        ])
        console.log('Created service providers')

        console.log('\nSeed completed successfully!')
        console.log(`Created ${users.length} users`)
        console.log(`Created ${events.length} events`)
        console.log(`Created ${serviceProviders.length} service providers`)
        console.log('\nTest login credentials:')
        console.log('Email: john@example.com (Subscribed)')
        console.log('Email: jane@example.com (Not subscribed)')
        console.log('Password: password123')

        await mongoose.disconnect()
        process.exit(0)
    } catch (error) {
        console.error('Seed error:', error)
        process.exit(1)
    }
}

seed()
