// "use client";
// import React, { useMemo, useState } from "react";
// import type { ReactElement } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getSortedRowModel,
//   flexRender,
// } from "@tanstack/react-table";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// type ColumnDef = {
//   accessorKey?: string;
//   header: string;
//   cell?: (props: any) => ReactElement;
//   id?: string;
// };

// type Props = {
//   data: any[];
//   columns: ColumnDef[];
//   title?: string;
//   enableExport?: boolean;
// };

// export default function CTdata({
//   data,
//   columns,
//   title = "Data Tabel",
//   enableExport = true,
// }: Props) {
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [sorting, setSorting] = useState([]);
//   const [exportOpen, setExportOpen] = useState(false);

//   const table = useReactTable({
//     data: data ?? [],
//     columns,
//     state: { globalFilter, sorting },
//     onGlobalFilterChange: setGlobalFilter,
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//   });

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     XLSX.writeFile(workbook, `${title}.xlsx`);
//   };

//   const exportToCSV = () => {
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const csv = XLSX.utils.sheet_to_csv(worksheet);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `${title}.csv`;
//     link.click();
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text(title, 14, 16);
//     const headers = columns.map((col) => col.header);
//     const rows = data.map((row) =>
//       columns.map((col) => row[col.accessorKey ?? col.id ?? ""])
//     );

//     autoTable(doc, {
//       head: [headers],
//       body: rows,
//       startY: 20,
//     });

//     doc.save(`${title}.pdf`);
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">{title}</h2>
//         {enableExport && (
//           <div className="relative inline-block text-left">
//             <button
//               onClick={() => setExportOpen((prev) => !prev)}
//               className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
//             >
//               📁 Ekspor ▼
//             </button>
//             {exportOpen && (
//               <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
//                 <button
//                   onClick={() => {
//                     exportToExcel();
//                     setExportOpen(false);
//                   }}
//                   className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
//                 >
//                   📊 Excel
//                 </button>
//                 <button
//                   onClick={() => {
//                     exportToCSV();
//                     setExportOpen(false);
//                   }}
//                   className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
//                 >
//                   📄 CSV
//                 </button>
//                 <button
//                   onClick={() => {
//                     exportToPDF();
//                     setExportOpen(false);
//                   }}
//                   className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
//                 >
//                   🧾 PDF
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <input
//         type="text"
//         placeholder="🔍 Cari..."
//         value={globalFilter}
//         onChange={(e) => setGlobalFilter(e.target.value)}
//         className="mb-4 px-4 py-2 border rounded-md w-full max-w-sm"
//       />

//       <div className="overflow-x-auto rounded-xl shadow ring-1 ring-gray-200">
//         <table className="min-w-full divide-y divide-gray-300 bg-white">
//           <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id}>
//                 <th className="px-6 py-3 text-left text-sm font-semibold cursor-pointer select-none">No</th>
//                 {headerGroup.headers.map((header) => (
//                   <th
//                     key={header.id}
//                     onClick={header.column.getToggleSortingHandler?.()}
//                     className="px-6 py-3 text-left text-sm font-semibold cursor-pointer select-none"
//                   >
//                     {flexRender(header.column.columnDef.header, header.getContext())}
//                     {header.column.getIsSorted() === "asc"
//                       ? " 🔼"
//                       : header.column.getIsSorted() === "desc"
//                       ? " 🔽"
//                       : ""}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {table.getRowModel().rows.length === 0 ? (
//               <tr>
//                 <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
//                   Tidak ada data.
//                 </td>
//               </tr>
//             ) : (
//               table.getRowModel().rows.map((row,ind) => (
//                 <tr key={row.id} className="hover:bg-blue-50 transition">
//                   <td className="px-6 py-4 text-sm text-gray-700">{ind+1}</td>
//                   {row.getVisibleCells().map((cell) => (
//                     <td key={cell.id} className="px-6 py-4 text-sm text-gray-700">
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState } from "react";
import type { ReactElement } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { ColumnDef as TanstackColumnDef } from "@tanstack/react-table";

type Props<T extends object> = {
  data: T[];
  columns: TanstackColumnDef<T, any>[]; // gunakan tipe resmi
  title?: string;
  enableExport?: boolean;
};

// type ColumnDef<T> = {
//   accessorKey?: keyof T;
//   header: string | ((props: any) => ReactElement);
//   cell?: (props: any) => ReactElement;
//   id?: string;
// };

// type Props<T> = {
//   data: T[];
//   columns: ColumnDef<T>[];
//   title?: string;
//   enableExport?: boolean;
// };

export default function CTdata<T extends Record<string, any>>({
  data,
  columns,
  title = "Data Tabel",
  enableExport = true,
}: Props<T>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [exportOpen, setExportOpen] = useState(false);

  const table = useReactTable({
    data,
    columns:columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${title}.xlsx`);
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(title, 14, 16);
    const headers = columns.map((col) => typeof col.header === "string" ? col.header : "");
    const rows = data.map((row) =>
      columns.map((col) => {
        const key =
          "accessorKey" in col
            ? col.accessorKey
            : "id" in col
            ? col.id
            : undefined;

        return key ? row[key as keyof T] : "";
      })
    );


    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
    });

    doc.save(`${title}.pdf`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {enableExport && (
          <div className="relative inline-block text-left">
            <button
              onClick={() => setExportOpen((prev) => !prev)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
            >
              📁 Ekspor ▼
            </button>
            {exportOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    exportToExcel();
                    setExportOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                >
                  📊 Excel
                </button>
                <button
                  onClick={() => {
                    exportToCSV();
                    setExportOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                >
                  📄 CSV
                </button>
                <button
                  onClick={() => {
                    exportToPDF();
                    setExportOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                >
                  🧾 PDF
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="🔍 Cari..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 px-4 py-2 border rounded-md w-full max-w-sm"
      />

      <div className="overflow-x-auto rounded-xl shadow ring-1 ring-gray-200">
        <table className="min-w-full divide-y divide-gray-300 bg-white">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <th className="px-6 py-3 text-left text-sm font-semibold">No</th>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler?.()}
                    className="px-6 py-3 text-left text-sm font-semibold cursor-pointer select-none"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc"
                      ? " 🔼"
                      : header.column.getIsSorted() === "desc"
                      ? " 🔽"
                      : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, ind) => (
                <tr key={row.id} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-700">{ind + 1}</td>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-sm text-gray-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}