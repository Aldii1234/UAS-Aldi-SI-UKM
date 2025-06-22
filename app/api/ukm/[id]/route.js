import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import UKM from '@/models/UKM'
import AnggotaUKM from '@/models/AnggotaUKM'

export async function GET(request, { params }) {
  await connectDB()
  const { id } = params

  try {
    const ukm = await UKM.findById(id)
    if (!ukm) throw new Error('UKM tidak ditemukan')
    return NextResponse.json(ukm)
  } catch (error) {
    return NextResponse.json({ message: 'UKM tidak ditemukan' }, { status: 404 })
  }
}

export async function PUT(request, { params }) {
  await connectDB()
  const { id } = params
  const body = await request.json()

  try {
    const updatedUKM = await UKM.findByIdAndUpdate(id, body, { new: true })
    if (!updatedUKM) throw new Error('UKM tidak ditemukan')
    return NextResponse.json({ message: 'UKM berhasil diperbarui', data: updatedUKM })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengedit UKM' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  await connectDB()
  const { id } = params

  try {
    await AnggotaUKM.deleteMany({ ukm: id })
    await UKM.findByIdAndDelete(id)
    return NextResponse.json({ message: 'UKM berhasil dihapus' })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus UKM' }, { status: 500 })
  }
}
