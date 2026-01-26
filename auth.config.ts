import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin, type NextAuthConfig } from "next-auth";
import prisma from "./lib/prisma";
import { compareSync } from "bcrypt-ts";

class CustomAuthError extends CredentialsSignin {
  constructor(message: string) {
    super();
    this.code = message; // Kita masukkan pesan kita ke properti 'code'
  }
}

export default {
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    GitHub({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;
        const normalizedEmail = email.toLowerCase();

        const user = await prisma.user.findUnique({ where: { email: normalizedEmail }, include: { accounts: true } });
        if (!user) return null;

        if (!user.password) {
          const provider = user.accounts[0].provider;
          throw new CustomAuthError(`You have an account with ${provider}. Please sign in with ${provider}`);
        }

        const passwordMatch = compareSync(password, user.password);
        if (!passwordMatch) return null;

        return user;
      },
    }),
  ],
  pages: { signIn: "/signin" },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        console.log(user);
        // if (account?.provider !== "credentials" && user.emailVerified === null) {
        //   const updatedUser = await prisma.user.update({
        //     where: { id: user.id as string },
        //     data: { emailVerified: new Date() },
        //     select: { emailVerified: true, role: true, phone: true }, // Ambil data yang diperlukan
        //   });

        //   user.emailVerified = updatedUser.emailVerified;
        //   user.role = updatedUser.role;
        // }

        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.phone = user.phone;
        token.emailVerified = user.emailVerified;
        token.pendingEmail = user.pendingEmail;
        return token;
      }

      if (trigger === "update" || !token.id) {
        const latestUser = await prisma.user.findUnique({ where: { id: token.id as string } });
        if (latestUser) {
          token.id = latestUser.id;
          token.name = latestUser.name;
          token.email = latestUser.email;
          token.role = latestUser.role;
          token.phone = latestUser.phone;
          token.emailVerified = latestUser.emailVerified;
          token.pendingEmail = latestUser.pendingEmail;
        }
      }

      return token;
    },
    async session({ session, token }) {
      const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
      session.user.id = dbUser?.id as string;
      session.user.name = dbUser?.name;
      session.user.email = dbUser?.email as string;
      session.user.role = dbUser?.role;
      session.user.phone = dbUser?.phone;
      session.user.emailVerified = dbUser?.emailVerified as Date | null;
      session.user.pendingEmail = dbUser?.pendingEmail;
      return session;
    },
    // async signIn({ user, account }) {
    //   const prisma = (await import("@/lib/prisma")).default;
    //   if (account?.provider !== "credentials") {
    //     const existingUser = await prisma.user.findUnique({ where: { email: user.email as string } });

    //     if (existingUser) {
    //       const existingAccount = await prisma.account.findFirst({
    //         where: { provider: account?.provider, providerAccountId: account?.providerAccountId },
    //       });

    //       if (!existingAccount) {
    //         await prisma.account.create({
    //           data: {
    //             userId: existingUser.id,
    //             provider: account?.provider as string,
    //             providerAccountId: account?.providerAccountId as string,
    //             type: account?.type as string,
    //             access_token: account?.access_token as string,
    //             token_type: account?.token_type,
    //             scope: account?.scope,
    //           },
    //         });
    //       }
    //       return true;
    //     }
    //   }
    //   return true;
    // },
  },
} satisfies NextAuthConfig;
