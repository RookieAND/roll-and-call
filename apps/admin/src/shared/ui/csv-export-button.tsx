"use client";

import { Button } from "@roll-and-call/ui";

interface CsvExportButtonProps {
  fileName: string;
  header: string[];
  rows: (string | number)[][];
}

const escapeCell = (cell: string | number) => `"${String(cell).replaceAll('"', '""')}"`;

export function CsvExportButton({ fileName, header, rows }: CsvExportButtonProps) {
  const download = () => {
    // 엑셀이 한글을 깨뜨리지 않게 BOM을 붙인다.
    const csv = `﻿${[header, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n")}`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return (
    <Button variant="outline" colorPalette="gray" size="sm" onClick={download}>
      CSV 내보내기
    </Button>
  );
}
