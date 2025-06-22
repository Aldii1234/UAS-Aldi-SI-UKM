import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/db'
import User from '@/models/User'

export async function POST(req) {
  try {
    const { email, password } = await req.json()
    await connectDB()

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json({ message: 'Password salah' }, { status: 401 })
    }

    // ✅ Kembalikan _id agar frontend bisa pakai user._id
    return NextResponse.json({
      message: 'Login berhasil',
      user: {
        _id: user._id, // ✅ GANTI dari id → _id
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
