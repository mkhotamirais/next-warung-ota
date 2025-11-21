"use client";

import React, { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

type InputAttributes = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "ref" | "className" | "type">;

interface InputProps extends InputAttributes {
  ref?: React.ForwardedRef<HTMLInputElement>;
  id: string;
  label?: string | React.ReactNode;
  type?: string;
  error?: string[] | undefined;
  className?: string;
}

export default function Input({ ref, id, label, type = "text", error, className, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const finalType = type === "password" ? (showPassword ? "text" : "password") : type;

  const baseInputClass =
    "flex h-10 w-full rounded-lg border border-gray-400 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className={twMerge(className, "mb-4")}>
      <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          ref={ref}
          type={finalType}
          id={id}
          name={id}
          className={twMerge(baseInputClass, type === "password" ? "pr-10" : "")}
          placeholder="Placeholder.."
          {...props}
        />

        {type === "password" ? (
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-900"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <LuEye className="h-5 w-5" /> : <LuEyeOff className="h-5 w-5" />}
          </button>
        ) : null}
      </div>

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
