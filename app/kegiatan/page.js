'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'

export default function KegiatanPage() {
  const [kegiatanList, setKegiatanList] = useState([])

  useEffect(() => {
    fetchKegiatan()
  }, [])

  const fetchKegiatan = async () => {
    try {
      const res = await fetch('/api/kegiatan')
      const data = await res.json()
      if (res.ok) {
        setKegiatanList(data)
      } else {
        Swal.fire('Gagal', data.message || 'Gagal memuat data.', 'error')
      }
    } catch (err) {
      Swal.fire('Gagal', 'Terjadi kesalahan saat memuat data.', 'error')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Daftar Kegiatan UKM</h1>

        {kegiatanList.length === 0 ? (
          <p className="text-gray-500">Belum ada kegiatan tersedia.</p>
        ) : (
          <div className="space-y-4">
            {kegiatanList.map((keg) => (
              <div key={keg._id} className="border p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-blue-800">{keg.judul}</h2>
                <p className="text-sm text-gray-600">{keg.deskripsi}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Tanggal: {new Date(keg.tanggal).toLocaleDateString()}
                </p>
                <p className="text-xs italic text-gray-400">
                  UKM: {keg.ukmId?.name || 'Tidak tersedia'}
                </p>
                <p className="text-xs text-gray-600 mt-1">Status: <span className="font-semibold">{keg.status}</span></p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link href="/">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Kembali ke Beranda
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
