// File: src/components/common/ErrorBoundary.tsx
"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { toast } from "sonner"; // Kita gunakan toast yang sudah ada

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary kustom untuk menangkap error di komponen anak
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Inisialisasi state awal
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  // Method lifecycle yang dipanggil ketika ada error
  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Memperbarui state agar render fallback UI
    return { hasError: true, error };
  }

  // Method lifecycle untuk logging error
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by boundary:", error, errorInfo);

    // Opsional: Kirim log error ke layanan monitoring (Sentry, New Relic, dll.)
  }

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || "Terjadi kesalahan tak terduga.";

      // Deteksi error jaringan atau kegagalan pemuatan code chunk
      const isNetworkOrChunkError =
        errorMessage.includes("chunk") ||
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("loading") ||
        errorMessage.includes("net::ERR_INTERNET_DISCONNECTED");

      if (isNetworkOrChunkError) {
        // Tampilkan toast error jaringan, tapi jangan me-render fallback error yang terlalu mencolok
        // Kita hanya akan menampilkan pesan yang informatif.
        toast.error("⚠️ Koneksi terputus atau gagal memuat data. Mohon periksa jaringan Anda.", { duration: 8000 });

        // FALLBACK UI Sederhana:
        return (
          <div className="p-8 text-center bg-gray-50 border border-red-300 rounded-lg shadow-md">
            <h1 className="text-xl font-semibold text-red-600">Koneksi Terputus</h1>
            <p className="mt-2 text-gray-700">Aplikasi gagal memuat data. Mohon periksa koneksi internet Anda.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Muat Ulang Halaman
            </button>
          </div>
        );
      }

      // Jika error bukan karena jaringan/chunk (misalnya error rendering biasa)
      return (
        <div className="p-8 text-center bg-gray-50 border border-red-300 rounded-lg shadow-md">
          <h1 className="text-xl font-semibold text-red-600">Terjadi Kesalahan Aplikasi</h1>
          <p className="mt-2 text-gray-700">Kami mohon maaf, terjadi kesalahan saat memproses permintaan Anda.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
