'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import {
  FaArrowLeft,
  FaFilePdf,
  FaFileExcel
} from 'react-icons/fa'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import * as XLSX from 'xlsx'

export default function PeringkatUKMPage() {
  const [peringkat, setPeringkat] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.role !== 'admin') {
        Swal.fire('Akses Ditolak', 'Anda bukan admin.', 'warning')
        router.push('/login')
        return
      }
      setUser(parsed)
      fetchPeringkat()
    } else {
      Swal.fire('Akses Ditolak', 'Silakan login terlebih dahulu.', 'warning')
      router.push('/login')
    }
  }, [])

  const fetchPeringkat = async () => {
    try {
      const res = await fetch('/api/peringkat')
      const data = await res.json()
      if (res.ok) {
        setPeringkat(data)
        setFiltered(data)
      } else {
        Swal.fire('Gagal', data.message || 'Gagal memuat data peringkat.', 'error')
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Gagal', 'Terjadi kesalahan.', 'error')
    }
  }

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase()
    setSearch(val)
    const filteredData = peringkat.filter((ukm) =>
      ukm.name.toLowerCase().includes(val)
    )
    setFiltered(filteredData)
  }

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filtered)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PeringkatUKM')
    XLSX.writeFile(workbook, 'peringkat_ukm.xlsx')
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-sky-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <button
            onClick={() => router.push('/dashboard/admin')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 text-sm"
          >
            <FaArrowLeft /> Kembali
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-sky-700">📈 Peringkat UKM</h1>
        </div>

        {/* Search & Export */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <input
            type="text"
            placeholder="Cari nama UKM..."
            value={search}
            onChange={handleSearch}
            className="border px-4 py-2 rounded-lg w-full sm:w-1/3 text-sm"
          />
          <div className="flex gap-3">
            <button
              onClick={exportExcel}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <FaFileExcel /> Excel
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border-collapse rounded-lg shadow-sm">
            <thead className="bg-sky-200 text-sky-800 uppercase text-xs">
              <tr>
                <th className="p-2 text-left">No</th>
                <th className="p-2 text-left">UKM</th>
                <th className="p-2 text-center">Kegiatan</th>
                <th className="p-2 text-center">👍 Setuju</th>
                <th className="p-2 text-center">👎 Tidak</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 bg-white divide-y divide-sky-100">
              {filtered.map((ukm, i) => (
                <tr key={ukm._id} className="hover:bg-sky-50">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2 font-medium text-sky-900">{ukm.name}</td>
                  <td className="p-2 text-center">{ukm.totalKegiatan || 0}</td>
                  <td className="p-2 text-center text-green-600">{ukm.totalSetuju || 0}</td>
                  <td className="p-2 text-center text-red-600">{ukm.totalTidak || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grafik */}
        <div className="bg-white p-4 rounded-lg shadow-inner">
          <h2 className="text-base sm:text-lg font-semibold text-sky-700 mb-3">Grafik Voting UKM</h2>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[500px] h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filtered}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalSetuju" fill="#10b981" name="Setuju" />
                  <Bar dataKey="totalTidak" fill="#ef4444" name="Tidak Setuju" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
