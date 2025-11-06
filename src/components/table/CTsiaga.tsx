"use client";
import DataTable, { createTheme } from "react-data-table-component";
import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// bikin tema custom
createTheme(
  "siagaTheme",
  {
    text: {
      primary: "#1f2937",
      secondary: "#4b5563",
    },
    background: {
      default: "#ffffff",
    },
    context: {
      background: "#2563eb",
      text: "#FFFFFF",
    },
    divider: {
      default: "#e5e7eb",
    },
    action: {
      button: "rgba(0,0,0,.54)",
      hover: "rgba(0,0,0,.08)",
      disabled: "rgba(0,0,0,.12)",
    },
  },
  "light"
);

interface SiagaTableProps {
  title: string;
  columns: any[];
  data: any[];
  keyField?: string;
}

const SiagaTable: React.FC<SiagaTableProps> = ({
  title,
  columns,
  data,
  keyField = "key",
}) => {
  const [filterText, setFilterText] = useState("");

  // filter data sesuai search
  const filteredData = useMemo(() => {
    if (!filterText) return data;
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [filterText, data]);

  // === Export Functions ===
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${title}.xlsx`);
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
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

    const headers = columns.map((col) => col.name ?? col.header ?? "");
    const rows = filteredData.map((row) =>
      columns.map((col) => row[col.selector ?? col.accessorKey ?? col.id ?? ""])
    );

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
    });

    doc.save(`${title}.pdf`);
  };

  // component search bar + export button
  const subHeaderComponent = useMemo(() => {
    return (
      <>
        <div className="flex justify-between w-full gap-2">
        {/* Search box */}
        <input
          type="text"
          placeholder="Cari data..."
          className="border rounded px-3 py-2 w-64 text-sm"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        {/* Export buttons */}
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            Excel
          </button>
          <button
            onClick={exportToCSV}
            className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            CSV
          </button>
          <button
            onClick={exportToPDF}
            className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            PDF
          </button>
        </div>
      </div>
      </>
    );
  }, [filterText, filteredData]);

  return (
    <div className="p-2 shadow-lg border border-gray-200 overflow-hidden">
      <DataTable
        title={title}
        columns={columns}
        data={filteredData}
        keyField={keyField}
        pagination
        highlightOnHover
        striped
        theme="siagaTheme"
        subHeader
        subHeaderComponent={subHeaderComponent}
        persistTableHead
      />
    </div>
  );
};

export default SiagaTable;
