import { getServerSession } from "next-auth";
import { authOptions } from "./auth-config";

/**
 * Get the current user session on the server side
 * Use this in Server Components and API routes
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get the current user from the session
 * Use this in Server Components and API routes
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

/**
 * Check if user is authenticated on the server side
 * Use this in Server Components and API routes
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}
