'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FaBars } from 'react-icons/fa'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const handleToggle = () => setOpen(!open)
  const handleLinkClick = () => setOpen(false)

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-sky-700 font-bold text-xl tracking-tight">
          UKM Kampus
        </Link>

        {/* Toggle button for mobile */}
        <button onClick={handleToggle} className="md:hidden">
          <FaBars size={20} className="text-sky-800" />
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-gray-600 hover:text-sky-600 transition">Beranda</Link>
          <Link href="/ukm" className="text-gray-600 hover:text-sky-600 transition">UKM</Link>
          <Link href="/kegiatan" className="text-gray-600 hover:text-sky-600 transition">Kegiatan</Link>
          <Link href="/dokumentasi" className="text-gray-600 hover:text-sky-600 transition">Dokumentasi</Link>
          <Link href="/login" className="text-white bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-xl text-sm font-medium shadow">
            Masuk
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 flex flex-col gap-3">
          <Link href="/" onClick={handleLinkClick} className="text-gray-700 hover:text-sky-600">Beranda</Link>
          <Link href="/ukm" onClick={handleLinkClick} className="text-gray-700 hover:text-sky-600">UKM</Link>
          <Link href="/kegiatan" onClick={handleLinkClick} className="text-gray-700 hover:text-sky-600">Kegiatan</Link>
          <Link href="/dokumentasi" onClick={handleLinkClick} className="text-gray-700 hover:text-sky-600">Dokumentasi</Link>
          <Link
            href="/login"
            onClick={handleLinkClick}
            className="text-white bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-xl text-sm font-medium shadow text-center"
          >
            Masuk
          </Link>
        </div>
      )}
    </nav>
  )
}
