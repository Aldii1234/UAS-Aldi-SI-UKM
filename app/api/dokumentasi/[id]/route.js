import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Dokumentasi from '@/models/Dokumentasi'
import { writeFile } from 'fs/promises'
import path from 'path'
import { mkdir } from 'fs/promises'

// PUT: Edit dokumentasi
export async function PUT(req, { params }) {
  try {
    await connectDB()

    const formData = await req.formData()
    const namaKegiatan = formData.get('namaKegiatan')
    const deskripsi = formData.get('deskripsi')
    const pengurus = formData.get('pengurus')
    const ukm = formData.get('ukm')
    const file = formData.get('file')

    if (!namaKegiatan || !deskripsi || !pengurus || !ukm) {
      return NextResponse.json({ message: 'Semua field wajib diisi' }, { status: 400 })
    }

    const updateData = {
      namaKegiatan,
      deskripsi,
      pengurus,
      ukm
    }

    // Jika ada file baru diupload
    if (file && typeof file === 'object') {
      const buffer = Buffer.from(await file.arrayBuffer())
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'dokumentasi')

      await mkdir(uploadDir, { recursive: true })

      const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
      const filePath = path.join(uploadDir, filename)
      const publicPath = `/uploads/dokumentasi/${filename}`

      await writeFile(filePath, buffer)
      updateData.filePath = publicPath
    }

    const updated = await Dokumentasi.findByIdAndUpdate(params.id, updateData, { new: true })

    if (!updated) {
      return NextResponse.json({ message: 'Dokumentasi tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Dokumentasi berhasil diperbarui', data: updated })
  } catch (err) {
    console.error('Edit error:', err)
    return NextResponse.json({ message: 'Gagal memperbarui dokumentasi' }, { status: 500 })
  }
}

// DELETE: Hapus dokumentasi
export async function DELETE(req, { params }) {
  try {
    await connectDB()

    const deleted = await Dokumentasi.findByIdAndDelete(params.id)

    if (!deleted) {
      return NextResponse.json({ message: 'Dokumentasi tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Dokumentasi berhasil dihapus' })
  } catch (err) {
    console.error('Delete error:', err)
    return NextResponse.json({ message: 'Gagal menghapus dokumentasi' }, { status: 500 })
  }
}
