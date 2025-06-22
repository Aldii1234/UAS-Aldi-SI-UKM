'use client'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa'

export default function ApproveKegiatanPage() {
  const [user, setUser] = useState(null)
  const [kegiatanList, setKegiatanList] = useState([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.role === 'admin') {
        setUser(parsed)
        fetchKegiatan()
      } else {
        Swal.fire('Akses Ditolak', 'Anda bukan admin.', 'warning')
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
      setKegiatanList(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Gagal memuat kegiatan', err)
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await fetch(`/api/kegiatan/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        Swal.fire('Berhasil', `Kegiatan telah di${status}.`, 'success')
        fetchKegiatan()
      } else {
        Swal.fire('Gagal', 'Gagal mengubah status.', 'error')
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">
        <button
          onClick={() => router.push('/dashboard/admin')}
          className="text-green-700 hover:text-green-900 mb-4 flex items-center gap-2"
        >
          <FaArrowLeft /> Kembali ke Dashboard
        </button>

        <h1 className="text-2xl font-bold text-green-700 mb-6">Approve Kegiatan</h1>

        {kegiatanList.length === 0 ? (
          <p className="text-gray-500">Belum ada kegiatan yang diajukan.</p>
        ) : (
          <div className="space-y-4">
            {kegiatanList.map((kegiatan) => (
              <div
                key={kegiatan._id}
                className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold text-green-800">{kegiatan.judul}</h2>
                  <p className="text-sm text-gray-600">{kegiatan.deskripsi}</p>
                  <p className="text-xs text-gray-400 mt-1">Tanggal: {new Date(kegiatan.tanggal).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500 italic">
                    UKM: {kegiatan.ukmId?.name || 'Tidak diketahui'} | Status:{' '}
                    <span className="font-semibold capitalize text-blue-600">
                      {kegiatan.status || 'menunggu'}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(kegiatan._id, 'disetujui')}
                    className="text-green-600 hover:text-green-800 flex items-center gap-1"
                    title="Setujui"
                  >
                    <FaCheckCircle /> Setujui
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(kegiatan._id, 'ditolak')}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    title="Tolak"
                  >
                    <FaTimesCircle /> Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
