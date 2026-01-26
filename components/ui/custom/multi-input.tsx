"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";

interface MultiInputProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
}

/**
 * Komponen Input Multi-tag yang mendukung pemisahan kata menggunakan koma atau Enter.
 * * @param value - Array string yang berisi daftar tag/item.
 * @param onChange - Fungsi callback untuk memperbarui array tag.
 * @param placeholder - Teks bantuan yang muncul di dalam input.
 * * @example
 * const [tags, setTags] = useState<string[]>([]);
 * <MultiInput
 * value={tags}
 * onChange={setTags}
 * placeholder="Contoh: Ayam, Kucing"
 * />
 */
export default function MultiInput({ value = [], onChange = () => {}, placeholder }: MultiInputProps) {
  const [inputValue, setInputValue] = useState("");

  const processTags = (input: string) => {
    // Split berdasarkan koma, hapus spasi, dan saring string kosong
    const newTags = input
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "" && !value.includes(tag));

    if (newTags.length > 0) {
      onChange([...value, ...newTags]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      processTags(inputValue);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder={placeholder || "Ketik dan tekan Enter atau gunakan koma..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button type="button" variant="outline" size="icon" onClick={() => processTags(inputValue)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
            {tag}
            <button
              tabIndex={-1}
              aria-label="remove tag"
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full outline-none hover:bg-destructive/20 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
