import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";
import { GithubProfile } from "next-auth/providers/github";
import { GoogleProfile } from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      profile(profile: GithubProfile) {
        console.log("Profile GitHub: ", profile);

        let userRole = "GitHub User";
        if (profile.email == "muhammadarham59@gmail.com") {
          userRole = "admin";
        }

        return {
          ...profile,
          role: userRole,
          id: profile.id.toLocaleString(),
        };
      },

      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),

    GoogleProvider({
      profile(profile: GoogleProfile) {
        console.log("Google Profile", profile);

        let userRole = "Google User";

        return {
          ...profile,
          role: userRole,
          id: profile.sub,
        };
      },

      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;
      return session;
    },
  },
};

export default NextAuth(authOptions);

// CredentialsProvider({
//   name: "Credentials",
//   credentials: {
//     username: { label: "Username", type: "text", placeholder: "jsmith" },
//     password: { label: "Password", type: "password" },
//   },
//   async authorize(credentials) {
//     const user = { id: "42", name: "Arham", password: "12345667" };

//     if (
//       credentials?.username === user.name &&
//       credentials?.password === user.password
//     ) {
//       return user;
//     } else {
//       return null;
//     }
//   },
// }),
