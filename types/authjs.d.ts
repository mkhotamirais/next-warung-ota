import { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: string;
    phone?: string | null;
    emailVerified?: Date | null;
    pendingEmail?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    role?: string;
    phone?: string | null;
    emailVerified?: Dae | null;
    pendingEmail?: string | null;
  }
}
