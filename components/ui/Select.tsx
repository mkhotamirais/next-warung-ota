"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
// Ikon LuChevronDown diganti dengan SVG inline untuk menghindari kesalahan resolusi dependensi.

// Definisi Tipe untuk Atribut HTML Select
type SelectAttributes = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id" | "ref" | "className">;

// Definisi Tipe untuk Opsi Select
interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// Definisi Tipe Props untuk Komponen Select
interface SelectProps extends SelectAttributes {
  ref?: React.ForwardedRef<HTMLSelectElement>;
  id: string;
  label?: string | React.ReactNode;
  options: Option[];
  error?: string[] | undefined;
  className?: string;
  placeholder?: string; // Placeholder untuk opsi pertama yang non-selectable
}

export default function Select({
  ref,
  id,
  label,
  options,
  error,
  className,
  placeholder = "Pilih salah satu...", // Default placeholder
  ...props
}: SelectProps) {
  // Kelas dasar untuk elemen select, disesuaikan agar terlihat modern
  const baseSelectClass =
    "appearance-none block h-10 w-full rounded-lg border border-gray-400 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition duration-150 ease-in-out";

  // Tambahkan gaya error jika ada
  const errorClass =
    error && error.length > 0
      ? "border-red-500 focus-visible:ring-red-500"
      : "border-gray-400 focus-visible:ring-primary";

  // State lokal untuk melacak nilai, berguna untuk memastikan placeholder tersembunyi setelah pemilihan
  // Menggunakan props.value sebagai nilai awal jika tersedia, jika tidak, gunakan string kosong.
  const [selectedValue, setSelectedValue] = useState(props.value || "");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Memperbarui state lokal
    setSelectedValue(event.target.value);
    // Meneruskan event ke handler onChange yang mungkin disediakan oleh pengguna
    if (props.onChange) {
      props.onChange(event);
    }
  };

  return (
    <div className={twMerge(className, "mb-4")}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Elemen Select */}
        <select
          ref={ref}
          id={id}
          name={id}
          className={twMerge(baseSelectClass, errorClass)}
          // Menggunakan selectedValue yang dikelola secara internal untuk mengontrol komponen
          value={selectedValue}
          onChange={handleChange}
          {...props}
        >
          {/* Opsi Placeholder (Disabled agar tidak dapat dipilih sebagai nilai akhir) */}
          <option value="" disabled={true}>
            {placeholder}
          </option>

          {/* Mapping Opsi dari Props */}
          {options.map((option, index) => (
            <option key={index} value={option.value} disabled={option.disabled} className="text-gray-800">
              {option.label}
            </option>
          ))}
        </select>

        {/* Ikon Chevron Down Kustom (SVG Inline) untuk menggantikan panah default browser */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Menampilkan Pesan Error */}
      {error && error.length > 0 && (
        <div aria-live="polite" aria-atomic="true" className="mt-1">
          {error.map((msg, index) => (
            <p key={index} className="text-sm text-red-500">
              {msg}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
