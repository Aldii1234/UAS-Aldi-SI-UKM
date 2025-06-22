'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { FaArrowLeft } from 'react-icons/fa'

export default function VotingPengurusPage() {
  const [user, setUser] = useState(null)
  const [kegiatanList, setKegiatanList] = useState([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.role === 'pengurus') {
        setUser(parsed)
        fetchVotingData()
      } else {
        Swal.fire('Akses Ditolak', 'Anda bukan pengurus.', 'warning')
        router.push('/login')
      }
    } else {
      Swal.fire('Akses Ditolak', 'Silakan login terlebih dahulu.', 'warning')
      router.push('/login')
    }
  }, [])

  const fetchVotingData = async () => {
    try {
      const res = await fetch('/api/vote/rekap')
      const data = await res.json()
      if (res.ok) {
        setKegiatanList(data)
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      Swal.fire('Gagal', 'Gagal memuat data voting.', 'error')
    }
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/dashboard/pengurus')}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
          >
            <FaArrowLeft /> Kembali ke Dashboard
          </button>
          <h1 className="text-xl font-bold text-blue-700">📊 Hasil Voting Kegiatan UKM</h1>
        </div>

        {kegiatanList.length === 0 ? (
          <p className="text-center text-gray-600">Belum ada kegiatan atau data voting.</p>
        ) : (
          <ul className="space-y-4">
            {kegiatanList.map((kegiatan) => (
              <li
                key={kegiatan._id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <h2 className="text-lg font-semibold text-blue-800">{kegiatan.judul}</h2>
                <p className="text-sm text-gray-600">{kegiatan.deskripsi}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Tanggal: {new Date(kegiatan.tanggal).toLocaleDateString()}
                </p>
                <p className="text-xs italic text-gray-400">
                  UKM: {kegiatan.ukmId?.name || 'Tidak tersedia'}
                </p>
                <div className="mt-3 flex gap-6 text-sm">
                  <span className="text-green-700 font-medium">
                    👍 Setuju: {kegiatan.setuju || 0}
                  </span>
                  <span className="text-red-700 font-medium">
                    👎 Tidak Setuju: {kegiatan.tidak || 0}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
