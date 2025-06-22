'use client'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import {
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaSearch
} from 'react-icons/fa'

export default function ApproveKegiatanPage() {
  const [user, setUser] = useState(null)
  const [kegiatanList, setKegiatanList] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('semua')
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'disetujui':
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Disetujui</span>
      case 'ditolak':
        return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">Ditolak</span>
      default:
        return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">Menunggu</span>
    }
  }

  const filteredList = kegiatanList.filter((k) => {
    const cocokJudul = k.judul.toLowerCase().includes(search.toLowerCase())
    const cocokStatus =
      filterStatus === 'semua' || k.status === filterStatus
    return cocokJudul && cocokStatus
  })

  if (!user) return null

  return (
    <main className="min-h-screen bg-green-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <button
            onClick={() => router.push('/dashboard/admin')}
            className="flex items-center gap-2 text-green-700 hover:text-green-900 font-medium text-sm sm:text-base"
          >
            <FaArrowLeft /> Kembali
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-green-700 text-center sm:text-left">
            Approve Kegiatan UKM
          </h1>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg w-full sm:w-auto">
            <FaSearch className="text-green-600" />
            <input
              type="text"
              placeholder="Cari judul kegiatan..."
              className="bg-transparent outline-none w-full sm:w-64 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-green-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
          >
            <option value="semua">Semua Status</option>
            <option value="menunggu">Menunggu</option>
            <option value="disetujui">Disetujui</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>

        {filteredList.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">Tidak ada kegiatan ditemukan.</p>
        ) : (
          <div className="grid gap-4">
            {filteredList.map((kegiatan) => (
              <div
                key={kegiatan._id}
                className="border rounded-xl p-4 sm:p-5 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-base sm:text-lg font-semibold text-green-800">{kegiatan.judul}</h2>
                    <p className="text-sm text-gray-700 mt-1">{kegiatan.deskripsi}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Tanggal: {new Date(kegiatan.tanggal).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      UKM: <span className="font-medium">{kegiatan.ukmId?.name || 'Tidak diketahui'}</span>
                    </p>
                    <div className="mt-2">{getStatusBadge(kegiatan.status)}</div>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 items-center sm:items-end">
                    <button
                      onClick={() => handleStatusUpdate(kegiatan._id, 'disetujui')}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm"
                    >
                      <FaCheckCircle /> Setujui
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(kegiatan._id, 'ditolak')}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
                    >
                      <FaTimesCircle /> Tolak
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
