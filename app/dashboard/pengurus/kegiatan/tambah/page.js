'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function TambahKegiatanPage() {
  const router = useRouter()
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [ukmId, setUkmId] = useState('')
  const [user, setUser] = useState(null)
  const [ukmList, setUkmList] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.role === 'pengurus') {
        setUser(parsed)
        fetchUKMList(parsed._id)
      } else {
        Swal.fire('Akses Ditolak', 'Anda bukan pengurus.', 'warning')
        router.push('/login')
      }
    } else {
      Swal.fire('Akses Ditolak', 'Silakan login terlebih dahulu.', 'warning')
      router.push('/login')
    }
  }, [])

  const fetchUKMList = async (pengurusId) => {
    try {
      const res = await fetch(`/api/ukm?pengurus=${pengurusId}`)
      const data = await res.json()
      setUkmList(data)
    } catch (err) {
      console.error('Gagal ambil data UKM', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!judul || !deskripsi || !tanggal || !ukmId) {
      return Swal.fire('Gagal', 'Semua data harus diisi', 'warning')
    }

    if (!user || !user._id) {
      return Swal.fire('Gagal', 'Data pengguna tidak valid.', 'error')
    }

    try {
      const payload = {
        judul,
        deskripsi,
        tanggal,
        ukmId,
        pengurusId: user._id,
      }

      console.log('Payload:', payload) // Debugging dev only

      const res = await fetch('/api/kegiatan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error('Gagal menyimpan')
      }

      Swal.fire('Berhasil', 'Kegiatan ditambahkan', 'success')
      router.push('/dashboard/pengurus/kegiatan')
    } catch (err) {
      console.error(err)
      Swal.fire('Gagal', 'Terjadi kesalahan saat menambahkan', 'error')
    }
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-xl font-bold text-blue-700 mb-4">Tambah Kegiatan UKM</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-sm text-gray-700">Judul Kegiatan</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-sm text-gray-700">Deskripsi</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-medium text-sm text-gray-700">Tanggal</label>
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-sm text-gray-700">Pilih UKM</label>
            <select
              value={ukmId}
              onChange={(e) => setUkmId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">-- Pilih UKM --</option>
              {ukmList.map((ukm) => (
                <option key={ukm._id} value={ukm._id}>
                  {ukm.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Kembali
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
