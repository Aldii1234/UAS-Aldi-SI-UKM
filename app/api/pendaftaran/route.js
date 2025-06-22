import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import AnggotaUKM from '@/models/AnggotaUKM'

export async function POST(req) {
  await connectDB()
  const { userId, ukmId, alasan, pengalaman } = await req.json()

  // Cek apakah sudah daftar
  const existing = await AnggotaUKM.findOne({ user: userId, ukm: ukmId })
  if (existing) {
    return NextResponse.json({ message: 'Anda sudah mendaftar UKM ini.' }, { status: 400 })
  }

  const anggota = new AnggotaUKM({
    user: userId,
    ukm: ukmId,
    alasan,
    pengalaman,
    status: 'pending',
  })

  await anggota.save()
  return NextResponse.json({ message: 'Pendaftaran berhasil.' })
}
