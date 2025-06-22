'use client'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

export default function MahasiswaKegiatanPage() {
  const [user, setUser] = useState(null)
  const [kegiatanList, setKegiatanList] = useState([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.role === 'mahasiswa') {
        setUser(parsed)
        fetchKegiatan()
      } else {
        Swal.fire('Akses Ditolak', 'Anda bukan mahasiswa.', 'warning')
        router.push('/login')
      }
    } else {
      Swal.fire('Akses Ditolak', 'Silakan login terlebih dahulu.', 'warning')
      router.push('/login')
    }
  }, [])

  const fetchKegiatan = async () => {
    try {
      const res = await fetch('/api/kegiatan')
      const data = await res.json()
      if (Array.isArray(data)) {
        setKegiatanList(data)
      } else {
        throw new Error('Data kegiatan tidak valid')
      }
    } catch (err) {
      Swal.fire('Gagal', 'Gagal memuat kegiatan.', 'error')
    }
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/dashboard/mahasiswa')}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Kembali ke Dashboard
          </button>
          <h1 className="text-2xl font-bold text-blue-700">📌 Daftar Kegiatan UKM</h1>
        </div>

        {kegiatanList.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada kegiatan yang tersedia.</p>
        ) : (
          <ul className="space-y-4">
            {kegiatanList.map((kegiatan) => (
              <li key={kegiatan._id} className="p-4 border rounded-lg shadow-sm bg-white">
                <h2 className="text-lg font-semibold text-blue-800">{kegiatan.judul}</h2>
                <p className="text-sm text-gray-700">{kegiatan.deskripsi}</p>
                <p className="text-xs text-gray-500 mt-1">Tanggal: {new Date(kegiatan.tanggal).toLocaleDateString()}</p>
                <p className="text-xs italic text-gray-400">
                  UKM: {kegiatan.ukmId?.name || 'Tidak tersedia'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
