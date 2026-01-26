"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
// import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef } from "react";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const { update, status } = useSession();
  const hasUpdated = useRef(false);

  useEffect(() => {
    // Jalankan hanya jika status sudah 'authenticated'
    // dan hanya satu kali per hard reload (menggunakan useRef)
    if (status === "authenticated" && !hasUpdated.current) {
      update({});
      hasUpdated.current = true;
      console.log("Session updated after hard reload");
    }
  }, [status, update]);

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
    [],
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
