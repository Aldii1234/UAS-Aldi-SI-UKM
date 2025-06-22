'use client'

import Navbar from '@/components/Navbar'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-sky-100 via-white to-white min-h-screen pt-20 px-6 md:px-16">
        <section className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-700 mb-4">
            Sistem Informasi UKM Mahasiswa
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Platform digital untuk mengelola UKM, kegiatan, dan keanggotaan mahasiswa secara efisien dan kolaboratif.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a href="/login" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-medium shadow-md">
              Masuk Sekarang
            </a>
            <a href="/register" className="border border-sky-600 text-sky-700 hover:bg-sky-100 px-6 py-3 rounded-xl font-medium shadow">
              Daftar Sebagai Mahasiswa
            </a>
          </div>
        </section>

        <section className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard title="Profil UKM" desc="Lihat informasi, visi, misi, dan kegiatan UKM kampus." icon="🎓" />
          <FeatureCard title="Agenda Kegiatan" desc="Jadwal kegiatan terbaru dari berbagai UKM." icon="📅" />
          <FeatureCard title="Dokumentasi & Voting" desc="Upload dokumentasi dan voting kegiatan favorit." icon="📸" />
        </section>
      </main>
    </>
  )
}

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition-all p-6 text-center border">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-sky-800">{title}</h3>
      <p className="text-gray-600 text-sm mt-2">{desc}</p>
    </div>
  )
}
