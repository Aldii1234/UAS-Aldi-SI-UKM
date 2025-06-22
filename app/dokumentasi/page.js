'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaCameraRetro } from 'react-icons/fa'

export default function DokumentasiPublikPage() {
  const [list, setList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dokumentasi')
        const data = await res.json()
        setList(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Gagal mengambil data dokumentasi:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 to-white p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-sky-700 flex items-center gap-2">
            <FaCameraRetro className="text-sky-600" />
            Dokumentasi Kegiatan UKM
          </h1>
          <Link href="/" className="text-sky-600 hover:underline text-sm">
            ← Kembali ke Beranda
          </Link>
        </div>

        {list.length === 0 ? (
          <p className="text-gray-500">Belum ada dokumentasi tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {list.map((doc) => (
              <div
                key={doc._id}
                className="border border-sky-100 rounded-xl shadow hover:shadow-md transition bg-white"
              >
                {doc.filePath && (
                  <img
                    src={doc.filePath}
                    alt={doc.namaKegiatan}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-sky-800">{doc.namaKegiatan}</h2>
                  <p className="text-sm text-gray-600 mt-1">{doc.deskripsi}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    📅 {new Date(doc.createdAt).toLocaleDateString('id-ID')} <br />
                    Oleh: {doc.pengurus?.name || 'Pengurus'} | UKM: {doc.ukm?.name || 'UKM'}
                  </p>
                  {doc.filePath && (
                    <a
                      href={doc.filePath}
                      className="text-blue-500 text-sm underline mt-1 inline-block"
                      target="_blank"
                      rel="noreferrer"
                    >
                      📄 Lihat Dokumentasi
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
