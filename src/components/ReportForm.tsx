"use client";
import { useState } from "react";

export default function ReportForm({ setReports }: any) {
  const [report, setReport] = useState({
    nama: "",
    nik: "",
    kategori: "Fasilitas Umum",
    deskripsi: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReports((prev: any[]) => [...prev, { ...report, tanggal: new Date().toISOString() }]);
    setReport({ nama: "", nik: "", kategori: "Fasilitas Umum", deskripsi: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white bg-gray-800 p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 text-white">Form Laporan</h2>
      <input
        type="text"
        placeholder="Nama"
        value={report.nama}
        onChange={(e) => setReport({ ...report, nama: e.target.value })}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="NIK"
        value={report.nik}
        onChange={(e) => setReport({ ...report, nik: e.target.value })}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <select
        value={report.kategori}
        onChange={(e) => setReport({ ...report, kategori: e.target.value })}
        className="w-full p-2 mb-2 border rounded"
      >
        <option>Fasilitas Umum</option>
        <option>Keamanan</option>
        <option>Kesehatan</option>
        <option>Lainnya</option>
      </select>
      <textarea
        placeholder="Deskripsi"
        value={report.deskripsi}
        onChange={(e) => setReport({ ...report, deskripsi: e.target.value })}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Kirim Laporan
      </button>
    </form>
  );
}
