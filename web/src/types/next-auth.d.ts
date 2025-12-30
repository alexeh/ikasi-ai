import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      lname?: string;
      role: 'teacher' | 'student' | 'admin';
      locale: string;
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    name: string;
    lname?: string;
    role: 'teacher' | 'student' | 'admin';
    locale: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    name: string;
    lname?: string;
    role: 'teacher' | 'student' | 'admin';
    locale: string;
    accessToken: string;
  }
}
