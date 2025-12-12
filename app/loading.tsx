import Load from "@/components/fallbacks/Load";
import React from "react";

export default function loading() {
  return (
    <main className="py-8">
      <div className="container">
        <Load />
      </div>
    </main>
  );
}
