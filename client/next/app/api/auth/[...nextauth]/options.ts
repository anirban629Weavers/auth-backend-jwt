import { fetchUser } from "@/http";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email:",
          placeholder: "example@example.com",
          type: "email",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "*****",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please enter an email and password");
        }

        try {
          const user = await fetchUser(credentials);
          return user;
        } catch (error) {
          console.log(error);
          return error;
        }
      },
    }),
  ],
  secret: "ASD&*",
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
