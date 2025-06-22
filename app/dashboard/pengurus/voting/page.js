'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { FaArrowLeft, FaThumbsUp, FaThumbsDown } from 'react-icons/fa'

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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-xl ring-1 ring-blue-100">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/dashboard/pengurus')}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            <FaArrowLeft /> Kembali
          </button>
          <h1 className="text-2xl font-bold text-blue-800">📊 Rekap Voting Kegiatan UKM</h1>
        </div>

        {kegiatanList.length === 0 ? (
          <p className="text-center text-gray-600">Belum ada kegiatan atau data voting.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kegiatanList.map((kegiatan) => (
              <li
                key={kegiatan._id}
                className="bg-white border border-blue-100 hover:shadow-lg transition rounded-xl p-6 divide-y"
              >
                <div className="mb-3">
                  <h2 className="text-lg font-bold text-blue-700 mb-1">{kegiatan.judul}</h2>
                  <p className="text-sm text-gray-600">{kegiatan.deskripsi}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    📅 {new Date(kegiatan.tanggal).toLocaleDateString()}
                  </p>
                  <p className="text-xs italic text-gray-400">
                    🏛️ UKM: {kegiatan.ukmId?.name || 'Tidak tersedia'}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <FaThumbsUp className="text-lg" />
                    <span>Setuju:</span>
                    <span className="bg-green-100 px-2 py-1 rounded-full">{kegiatan.setuju || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-600 font-semibold">
                    <FaThumbsDown className="text-lg" />
                    <span>Tidak:</span>
                    <span className="bg-red-100 px-2 py-1 rounded-full">{kegiatan.tidak || 0}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
