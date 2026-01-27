"use client";

import React from "react";
import { Button } from "../ui/button";

export default function MenuDashboardFallback() {
  return (
    <div>
      <Button aria-label="fallback button" className="animate-pulse bg-gray-200 text-gray-200 w-full mb-1">
        Loading...
      </Button>
      <Button aria-label="fallback button" className="animate-pulse bg-gray-200 text-gray-200 w-full mb-1">
        Loading...
      </Button>
      <Button aria-label="fallback button" className="animate-pulse bg-gray-200 text-gray-200 w-full mb-1">
        Loading...
      </Button>
      <Button aria-label="fallback button" className="animate-pulse bg-gray-200 text-gray-200 w-full mb-1">
        Loading...
      </Button>
      <Button aria-label="fallback button" className="animate-pulse bg-gray-200 text-gray-200 w-full mb-1">
        Loading...
      </Button>
    </div>
  );
}
