import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/db'
import User from '@/models/User'

export async function GET() {
  try {
    await connectDB()

    const hashedPassword = await bcrypt.hash('admin12345', 10)

    const admin = await User.create({
      name: 'Admin Utama',
      email: 'admin@ukm.ac.id',
      password: hashedPassword,
      role: 'admin',
    })

    return NextResponse.json({ message: 'Admin berhasil dibuat', admin })
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
