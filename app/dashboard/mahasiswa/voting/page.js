'use client'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

export default function VotingPage() {
  const [user, setUser] = useState(null)
  const [kegiatanList, setKegiatanList] = useState([])
  const [userVotes, setUserVotes] = useState({})
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.role === 'mahasiswa') {
        setUser(parsed)
        fetchKegiatan()
        fetchUserVotes(parsed._id)
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
      if (Array.isArray(data)) setKegiatanList(data)
      else throw new Error('Format kegiatan salah')
    } catch (err) {
      Swal.fire('Gagal', 'Gagal memuat kegiatan.', 'error')
    }
  }

  const fetchUserVotes = async (userId) => {
    try {
      const res = await fetch(`/api/vote/user/${userId}`)
      const data = await res.json()
      if (res.ok) {
        const votes = {}
        data.forEach(v => {
          votes[v.kegiatanId] = v.vote // 'setuju' / 'tidak'
        })
        setUserVotes(votes)
      }
    } catch (err) {
      console.error('Gagal memuat vote:', err)
    }
  }

  const handleVote = async (kegiatanId, vote) => {
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, kegiatanId, vote }),
    })

    const result = await res.json()
    if (res.ok) {
      Swal.fire('Berhasil', result.message, 'success')
      setUserVotes((prev) => ({ ...prev, [kegiatanId]: vote }))
    } else {
      Swal.fire('Gagal', result.message || 'Terjadi kesalahan.', 'error')
    }
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/dashboard/mahasiswa')}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Kembali ke Dashboard
          </button>
          <h1 className="text-2xl font-bold text-blue-700">🗳️ Voting Kegiatan UKM</h1>
        </div>

        {kegiatanList.length === 0 ? (
          <p className="text-center text-gray-600">Belum ada kegiatan tersedia.</p>
        ) : (
          <ul className="space-y-4">
            {kegiatanList.map((kegiatan) => (
              <li key={kegiatan._id} className="border rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-bold text-blue-800">{kegiatan.judul}</h2>
                <p className="text-sm text-gray-600">{kegiatan.deskripsi}</p>
                <p className="text-xs text-gray-500 mt-1">Tanggal: {new Date(kegiatan.tanggal).toLocaleDateString()}</p>
                <p className="text-xs italic text-gray-400">UKM: {kegiatan.ukmId?.name || 'Tidak tersedia'}</p>

                <div className="mt-3 flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleVote(kegiatan._id, 'setuju')}
                    disabled={userVotes[kegiatan._id]}
                    className={`px-3 py-1 rounded text-sm ${
                      userVotes[kegiatan._id] === 'setuju'
                        ? 'bg-green-500 text-white'
                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                    }`}
                  >
                    👍 Setuju
                  </button>
                  <button
                    onClick={() => handleVote(kegiatan._id, 'tidak')}
                    disabled={userVotes[kegiatan._id]}
                    className={`px-3 py-1 rounded text-sm ${
                      userVotes[kegiatan._id] === 'tidak'
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 hover:bg-red-200 text-red-700'
                    }`}
                  >
                    👎 Tidak Setuju
                  </button>

                  {userVotes[kegiatan._id] && (
                    <span className="text-sm text-gray-500 ml-2 italic">
                      Anda memilih: {userVotes[kegiatan._id]}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
