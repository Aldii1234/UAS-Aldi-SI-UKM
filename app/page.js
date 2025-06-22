'use client'

import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-sky-100 via-white to-white min-h-screen pt-20 px-6 md:px-16">
        <section className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-sky-700 mb-4"
          >
            Sistem Informasi UKM Mahasiswa
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-gray-600 mb-6"
          >
            Platform digital untuk mengelola UKM, kegiatan, dan keanggotaan mahasiswa secara efisien dan kolaboratif.
          </motion.p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a
              href="/login"
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition transform hover:scale-105"
            >
              Masuk Sekarang
            </a>
            <a
              href="/register"
              className="border border-sky-600 text-sky-700 hover:bg-sky-100 px-6 py-3 rounded-xl font-medium shadow transition transform hover:scale-105"
            >
              Daftar Sebagai Mahasiswa
            </a>
          </div>
        </section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          <FeatureCard title="Profil UKM" desc="Lihat informasi, visi, misi, dan kegiatan UKM kampus." icon="🎓" />
          <FeatureCard title="Agenda Kegiatan" desc="Jadwal kegiatan terbaru dari berbagai UKM." icon="📅" />
          <FeatureCard title="Dokumentasi & Voting" desc="Upload dokumentasi dan voting kegiatan favorit." icon="📸" />
        </motion.section>
      </main>
    </>
  )
}

function FeatureCard({ title, desc, icon }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow hover:shadow-xl transition-all p-6 text-center border group hover:border-sky-300"
    >
      <div className="text-5xl mb-4 transition-transform group-hover:scale-110">{icon}</div>
      <h3 className="text-xl font-semibold text-sky-800">{title}</h3>
      <p className="text-gray-600 text-sm mt-2">{desc}</p>
    </motion.div>
  )
}
