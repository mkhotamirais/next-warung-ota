"use client";

import React from "react";

export default function FallbackUpdateData() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="w-20 h-5 rounded-xl bg-gray-200"></div>
        <div className="w-full h-10 rounded-xl bg-gray-200"></div>
      </div>
      <div className="space-y-2">
        <div className="w-20 h-5 rounded-xl bg-gray-200"></div>
        <div className="w-full h-10 rounded-xl bg-gray-200"></div>
      </div>
      <div className="space-y-2">
        <div className="w-20 h-5 rounded-xl bg-gray-200"></div>
        <div className="w-full h-10 rounded-xl bg-gray-200"></div>
      </div>
      <div className="h-10 w-18 rounded-xl bg-gray-200"></div>
    </div>
  );
}
