'use client'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

export default function DokumentasiMahasiswaPage() {
  const [user, setUser] = useState(null)
  const [list, setList] = useState([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.role === 'mahasiswa') {
        setUser(parsed)
        fetchDokumentasi()
      } else {
        Swal.fire('Akses Ditolak', 'Anda bukan mahasiswa.', 'warning')
        router.push('/login')
      }
    } else {
      Swal.fire('Akses Ditolak', 'Silakan login terlebih dahulu.', 'warning')
      router.push('/login')
    }
  }, [])

  const fetchDokumentasi = async () => {
    try {
      const res = await fetch('/api/dokumentasi')
      const data = await res.json()
      if (Array.isArray(data)) {
        setList(data)
      } else {
        throw new Error('Data bukan array')
      }
    } catch (err) {
      console.error('Gagal fetch dokumentasi:', err)
      Swal.fire('Gagal', 'Tidak dapat memuat dokumentasi.', 'error')
    }
  }

  const handleBack = () => {
    router.back()
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">
            📷 Dokumentasi Kegiatan UKM
          </h1>
          <button
            onClick={handleBack}
            className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1 rounded-lg shadow"
          >
            ⬅ Kembali
          </button>
        </div>

        {list.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada dokumentasi tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {list.map((doc) => (
              <div
                key={doc._id}
                className="bg-gray-50 border rounded-lg shadow-sm overflow-hidden"
              >
                {doc.filePath && (
                  <img
                    src={doc.filePath}
                    alt="Dokumentasi"
                    className="w-full h-52 object-cover"
                  />
                )}
                <div className="p-4">
                  <p className="font-bold text-blue-800">{doc.namaKegiatan}</p>
                  <p className="text-sm text-gray-600">{doc.deskripsi}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Oleh: {doc.pengurus?.name || '-'} | UKM: {doc.ukm?.name || '-'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
