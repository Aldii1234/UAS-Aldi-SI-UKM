// app/api/kegiatan/[id]/route.js
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Kegiatan from '@/models/Kegiatan'

export async function PUT(request, { params }) {
  await connectDB()
  const { id } = params
  const body = await request.json()

  try {
    const updated = await Kegiatan.findByIdAndUpdate(id, body, { new: true })

    if (!updated) {
      return NextResponse.json({ message: 'Kegiatan tidak ditemukan.' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Kegiatan berhasil diperbarui.', kegiatan: updated })
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  await connectDB()
  const { id } = params

  try {
    const deleted = await Kegiatan.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ message: 'Kegiatan tidak ditemukan.' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Kegiatan berhasil dihapus.' })
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  await connectDB()
  const { id } = params
  const { status } = await request.json()

  try {
    const updated = await Kegiatan.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json({ message: 'Kegiatan tidak ditemukan.' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Status kegiatan diperbarui.', kegiatan: updated })
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
