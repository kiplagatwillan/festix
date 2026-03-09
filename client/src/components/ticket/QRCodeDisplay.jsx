import React from "react";
import { Download, Share2, Maximize2 } from "lucide-react";

const QRCodeDisplay = ({ qrCode, ticketId, eventTitle }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center">
      <div className="bg-gray-50 p-4 rounded-2xl mb-4 border-2 border-dashed border-gray-200">
        <img
          src={qrCode}
          alt="Ticket QR Code"
          className="w-48 h-48 md:w-64 md:h-64 object-contain mix-blend-multiply"
        />
      </div>

      <div className="text-center mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
          Ticket ID
        </p>
        <p className="text-sm font-mono text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
          {ticketId}
        </p>
      </div>

      <div className="flex gap-4 w-full">
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors"
          onClick={() => window.print()}
        >
          <Download className="w-4 h-4" /> Print
        </button>
        <button className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
