"use client";

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface InputMultipleProps {
  label: string;
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export default function InputMultiple({
  label,
  id,
  value,
  onChange,
  placeholder = "Ketik tag dan tekan Enter",
}: InputMultipleProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddValue = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue === "") return;

    const newTags = trimmedValue
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const updatedTags = [...value];
    newTags.forEach((tag) => {
      if (!updatedTags.includes(tag)) {
        updatedTags.push(tag);
      }
    });

    onChange(updatedTags);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddValue();
    }
  };

  const handleRemoveValue = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  // Fungsi baru untuk menghapus semua tags
  const handleClearAll = () => {
    onChange([]);
    setInputValue("");
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={id} className="block text-sm text-gray-600 font-semibold">
          {label}
        </label>
        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            title="Hapus semua tag"
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Hapus Semua
          </button>
        )}
      </div>

      <div className="flex text-sm flex-wrap gap-2 py-2 px-3 border border-gray-500 rounded-md">
        {value.map((tag) => (
          <button
            type="button"
            key={tag}
            onClick={() => handleRemoveValue(tag)}
            title="Hapus"
            className="bg-primary/20 text-primary rounded-full px-2 py-0.5 text-sm flex items-center gap-2"
          >
            <span>{tag}</span>
            <span>
              <FaTimes size={12} />
            </span>
          </button>
        ))}
        <input
          type="text"
          id={id}
          name={id}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (e.target.value.includes(",")) {
              handleAddValue();
            }
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleAddValue}
          placeholder={placeholder}
          className="flex-1 min-w-40 bg-transparent focus:outline-none"
        />
      </div>
    </div>
  );
}
