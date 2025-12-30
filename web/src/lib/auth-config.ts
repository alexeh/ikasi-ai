import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User as NextAuthUser } from "next-auth";
import type { JWT } from "next-auth/jwt";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Extend the built-in session types
export interface ExtendedUser extends NextAuthUser {
  id: string;
  email: string;
  name: string;
  lname?: string;
  role: 'teacher' | 'student' | 'admin';
  locale: string;
  accessToken: string;
}

export interface ExtendedJWT extends JWT {
  id: string;
  email: string;
  name: string;
  lname?: string;
  role: 'teacher' | 'student' | 'admin';
  locale: string;
  accessToken: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Invalid credentials");
          }

          const data = await response.json();
          
          // Decode JWT to get user info
          const tokenPayload = JSON.parse(
            Buffer.from(data.access_token.split('.')[1], 'base64').toString()
          );

          return {
            id: tokenPayload.sub,
            email: tokenPayload.email,
            name: tokenPayload.name || tokenPayload.email.split('@')[0],
            lname: tokenPayload.lname || '',
            role: tokenPayload.role,
            locale: tokenPayload.locale || 'eu',
            accessToken: data.access_token,
          } as ExtendedUser;
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error(error instanceof Error ? error.message : "Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.id = extendedUser.id;
        token.email = extendedUser.email;
        token.name = extendedUser.name;
        token.lname = extendedUser.lname;
        token.role = extendedUser.role;
        token.locale = extendedUser.locale;
        token.accessToken = extendedUser.accessToken;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      return token as ExtendedJWT;
    },
    async session({ session, token }) {
      const extendedToken = token as ExtendedJWT;
      
      if (session.user) {
        session.user = {
          ...session.user,
          id: extendedToken.id,
          email: extendedToken.email,
          name: extendedToken.name,
          lname: extendedToken.lname,
          role: extendedToken.role,
          locale: extendedToken.locale,
          accessToken: extendedToken.accessToken,
        } as ExtendedUser;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
