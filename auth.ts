import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
// import Google from "next-auth/providers/google";
// import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google,
    // GitHub,
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email) return null;
        const normalizedEmail = email.toLowerCase();
        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

        if (!user) return null;
        if (!password || password.length === 0) return user;
        if (!user.password) return null;

        const passwordMatch = compareSync(password, user.password);

        if (!passwordMatch) return null;
        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  callbacks: {
    async jwt({ token, user, trigger, account }) {
      if (user) {
        if (account?.provider !== "credentials" && user.emailVerified === null) {
          const updatedUser = await prisma.user.update({
            where: { id: user.id as string },
            data: { emailVerified: new Date() },
            select: { emailVerified: true, role: true, phone: true }, // Ambil data yang diperlukan
          });

          user.emailVerified = updatedUser.emailVerified;
          user.role = updatedUser.role;
        }

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
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.name) {
        session.user.name = token.name;
      }
      if (token.email) {
        session.user.email = token.email;
      }
      if (token.role) {
        session.user.role = token.role;
      }
      if (token.phone) {
        session.user.phone = token.phone;
      }
      if (token.emailVerified) {
        session.user.emailVerified = token.emailVerified;
      }
      if (token.pendingEmail) {
        session.user.pendingEmail = token.pendingEmail;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        const existingUser = await prisma.user.findUnique({ where: { email: user.email as string } });

        if (existingUser) {
          const existingAccount = await prisma.account.findFirst({
            where: { provider: account?.provider, providerAccountId: account?.providerAccountId },
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: account?.provider as string,
                providerAccountId: account?.providerAccountId as string,
                type: account?.type as string,
                access_token: account?.access_token as string,
                token_type: account?.token_type,
                scope: account?.scope,
              },
            });
          }
          return true;
        }
      }
      return true;
    },
  },
});
