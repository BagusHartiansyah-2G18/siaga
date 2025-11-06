"use client";

export default function ReportTable({ reports }) {
  return (
    <div className="bg-white bg-gray-800 p-4 rounded-xl shadow-md overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 text-white">
        Daftar Laporan
      </h2>
      {reports.length === 0 ? (
        <p className="text-gray-500 text-gray-400">
          Belum ada laporan masuk.
        </p>
      ) : (
        <table className="min-w-full border border-gray-300 border-gray-700 rounded-lg">
          <thead className="bg-gray-100 bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 text-gray-200">
                Nama
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 text-gray-200">
                NIK
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 text-gray-200">
                Kategori
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 text-gray-200">
                Deskripsi
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 text-gray-200">
                Tanggal
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr
                key={i}
                className="border-t border-gray-200 border-gray-700"
              >
                <td className="px-4 py-2 text-sm text-gray-800 text-gray-200">
                  {r.nama}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 text-gray-200">
                  {r.nik}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 text-gray-200">
                  {r.kategori}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 text-gray-200">
                  {r.deskripsi}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 text-gray-200">
                  {new Date(r.tanggal).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
