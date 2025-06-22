'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function UploadDokumentasiPage() {
  const [user, setUser] = useState(null)
  const [file, setFile] = useState(null)
  const [keterangan, setKeterangan] = useState('')
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.role === 'pengurus') {
        setUser(parsed)
      } else {
        Swal.fire('Akses Ditolak', 'Anda bukan pengurus.', 'warning')
        router.push('/login')
      }
    } else {
      Swal.fire('Akses Ditolak', 'Silakan login terlebih dahulu.', 'warning')
      router.push('/login')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file || !keterangan) {
      Swal.fire('Gagal', 'Semua field wajib diisi.', 'error')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('keterangan', keterangan)
    formData.append('pengurus', user._id)

    const res = await fetch('/api/dokumentasi', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    if (res.ok) {
      Swal.fire('Berhasil', data.message, 'success').then(() => {
        router.push('/dashboard/pengurus/dokumentasi')
      })
    } else {
      Swal.fire('Gagal', data.message || 'Upload gagal.', 'error')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">📤 Upload Dokumentasi</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded w-full"
          />
          <textarea
            placeholder="Keterangan dokumentasi"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              ⬅ Kembali
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
