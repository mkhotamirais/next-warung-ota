"use client";

import React, { ReactNode, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  children: ReactNode;
}

export default function Toggle({ pressed, onPressedChange, children, className, ...props }: ToggleProps) {
  const handleClick = () => {
    onPressedChange(!pressed);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        "inline-flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100",
        "p-2", // Menambahkan padding
        pressed && "bg-gray-200", // Styling untuk kondisi 'pressed'
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
