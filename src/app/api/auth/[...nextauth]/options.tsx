import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";
import { GithubProfile } from "next-auth/providers/github";
import { GoogleProfile } from "next-auth/providers/google";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { Console } from "console";

interface Credentials {
  email: string;
  password: string;
}

async function login(credentials: Credentials) {
  const user = await User.findOne({ email: credentials.email });
  if (user) {
    const match = await bcrypt.compare(credentials.password, user.password);

    if (match) {
      console.log("User found");
      return user; // Returning user for further processing
    }
  }
  return null; // Return null if user not found or password doesn't match
}

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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith2company.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "your-password",
        },
      },
      async authorize(credentials?: Credentials) {
        try {
          if (!credentials) {
            throw new Error("Credentials are required");
          }
          const user = await login(credentials);
          console.log(user);
          return user; // Return user if found, null otherwise
        } catch (err) {
          console.log(err);
          return null;
        }
      },
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
