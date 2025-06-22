import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import AnggotaUKM from '@/models/AnggotaUKM'

export async function GET(request, context) {
  await connectDB()
  const { id } = context.params

  try {
    const anggota = await AnggotaUKM.find({ ukm: id }).sort({ createdAt: -1 })
    return NextResponse.json(anggota)
  } catch (error) {
    console.error('Gagal mengambil data anggota UKM:', error)
    return NextResponse.json(
      { message: 'Gagal mengambil data anggota.' },
      { status: 500 }
    )
  }
}
