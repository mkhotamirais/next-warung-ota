"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import { redirect, usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
// import { routes as r } from "@/lib/content";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  // const { data: session } = useSession();
  // const pathname = usePathname();
  // const router = useRouter();

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
    []
  );

  // if (!session?.user && !r.authRoutes.some((route) => pathname !== route)) {
  //   router.refresh();
  //   router.replace("/signin");
  //   // redirect("/signin");
  //   return;
  // }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
