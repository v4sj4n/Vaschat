import NextAuth, { type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./lib/prisma";
import { type Account } from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GoogleProvider],
  pages: {
    signIn: "sign-in",
  },
  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: DefaultSession["user"];
      account: Account | null;
    }) {
      try {
        if (account && account.provider === "google") {
          const { email } = user;
          const existingUser = await prisma.user.findFirst({
            where: { email },
          });
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
              },
            });
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        return true;
      }
    },
  },
});
