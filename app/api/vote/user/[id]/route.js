import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDB from '@/lib/db'
import Vote from '@/models/Voting'

export async function GET(req, context) {
  const { params } = context // ✅ diambil secara async-safe
  try {
    await connectDB()

    const id = params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'ID user tidak valid.' }, { status: 400 })
    }

    const votes = await Vote.find({ user: id }).populate('kegiatan', 'judul')

    return NextResponse.json(votes)
  } catch (error) {
    console.error('⨯ Gagal mengambil data vote:', error)
    return NextResponse.json({ message: 'Gagal memuat data vote.' }, { status: 500 })
  }
}
