import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Dokumentasi from '@/models/Dokumentasi'
import cloudinary from '@/lib/cloudinary'
import streamifier from 'streamifier'

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
      ukm,
    }

    if (file && typeof file === 'object' && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())

      // Validasi mime type
      if (
        !file.type.startsWith('image/') &&
        !file.type.startsWith('video/')
      ) {
        return NextResponse.json(
          { message: 'Hanya file gambar atau video yang diperbolehkan' },
          { status: 400 }
        )
      }

      // Upload ke Cloudinary
      const uploadToCloudinary = () =>
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'ukm_dokumentasi',
              resource_type: file.type.startsWith('video/') ? 'video' : 'image',
            },
            (error, result) => {
              if (error) return reject(error)
              resolve(result)
            }
          )
          streamifier.createReadStream(buffer).pipe(uploadStream)
        })

      const result = await uploadToCloudinary()
      updateData.filePath = result.secure_url
    }

    const updated = await Dokumentasi.findByIdAndUpdate(params.id, updateData, {
      new: true,
    })

    if (!updated) {
      return NextResponse.json({ message: 'Dokumentasi tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Dokumentasi berhasil diperbarui', data: updated })
  } catch (err) {
    console.error('Edit error:', err)
    return NextResponse.json({ message: 'Gagal memperbarui dokumentasi', error: err.message }, { status: 500 })
  }
}

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
    return NextResponse.json({ message: 'Gagal menghapus dokumentasi', error: err.message }, { status: 500 })
  }
}
