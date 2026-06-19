"use client";

import { useState } from "react";
import { ArrowDownTrayIcon, PrinterIcon } from "@heroicons/react/24/outline";

export default function PrintButton() {
  const [printing, setPrinting] = useState(false);

  const handlePrint = () => {
    setPrinting(true);
    // Give state a moment to update before opening print modal
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 150);
  };

  return (
    <div className="no-print fixed bottom-8 right-8 z-50">
      <button
        onClick={handlePrint}
        disabled={printing}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
      >
        <PrinterIcon className="w-4 h-4 animate-pulse" />
        <span>{printing ? "Preparing PDF..." : "Print / Save PDF"}</span>
      </button>
    </div>
  );
}
