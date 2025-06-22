'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function AnggotaUKMPage() {
  const { id } = useParams()
  const [anggotaList, setAnggotaList] = useState([])

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/ukm/${id}/anggota`)
        if (!res.ok) throw new Error('Gagal mengambil data anggota')
        const data = await res.json()
        setAnggotaList(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [id])

  return (
    <main className="p-6 max-w-4xl mx-auto">
      {/* Tombol Kembali */}
      <div className="mb-4">
        <Link href="/dashboard/admin/ukm">
          <button className="text-sky-600 hover:text-sky-800 text-sm">
            ← Kembali ke Daftar UKM
          </button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">Daftar Anggota UKM</h1>

      {anggotaList.length === 0 ? (
        <p className="text-gray-500">Belum ada anggota yang tergabung.</p>
      ) : (
        <ul className="space-y-4">
          {anggotaList.map((anggota) => (
            <li
              key={anggota._id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <p className="font-semibold text-lg">{anggota.nama} ({anggota.nim})</p>
              <p className="text-sm text-gray-700">Jurusan: {anggota.jurusan}</p>
              <p className="text-sm text-gray-700">Status: 
                <span className={`ml-2 px-2 py-1 rounded text-white text-xs ${anggota.status === 'pending' ? 'bg-yellow-500' : anggota.status === 'disetujui' ? 'bg-green-600' : 'bg-red-500'}`}>
                  {anggota.status}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">Alasan: {anggota.alasan}</p>
              <p className="text-sm text-gray-500">Pengalaman: {anggota.pengalaman}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
