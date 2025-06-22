'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaUsers } from 'react-icons/fa'

export default function UKMListPage() {
  const [ukmList, setUkmList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/ukm')
        const data = await res.json()
        setUkmList(data)
      } catch (error) {
        console.error('Gagal mengambil data UKM:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 to-white p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-sky-700 flex items-center gap-2">
            <FaUsers className="text-sky-600" />
            Daftar UKM Masoem University
          </h1>
          <Link href="/" className="text-sky-600 hover:underline text-sm">
            ← Kembali ke Beranda
          </Link>
        </div>

        {ukmList.length === 0 ? (
          <p className="text-gray-500">Belum ada data UKM tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ukmList.map((ukm) => (
              <div
                key={ukm._id}
                className="p-5 border border-sky-100 rounded-xl shadow hover:shadow-md transition duration-300 transform hover:-translate-y-1 bg-white"
              >
                <h2 className="text-xl font-semibold text-sky-800 mb-2">{ukm.name}</h2>
                <p className="text-sm text-gray-600">{ukm.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
