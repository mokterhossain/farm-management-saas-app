import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma"; // Ensure this points to your Prisma client
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        subdomain: { label: "Subdomain", type: "text" },
      },
      async authorize(credentials) {
        // 1. Validation
        if (!credentials?.email || !credentials?.password || !credentials?.subdomain) {
          return null;
        }

        // 2. Find User by Email AND Tenant Subdomain
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
            tenant: { subdomain: credentials.subdomain },
            deletedAt: null, // Don't allow login for soft-deleted users
          },
          include: {
            // We need to fetch roles to pass them to the token
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        });

        // 3. Password Check
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // 4. Extract Primary Role
        // Assuming the first role in the list is the primary one
        const userRole = user.userRoles[0]?.role?.name || "Worker";

        // 5. Return the User object for the JWT callback
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          tenantId: user.tenantId,
          role: userRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 'user' is only available on sign-in
      if (user) {
        token.userId = user.id;
        token.tenantId = (user as any).tenantId;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Casting to 'any' to avoid the "Property does not exist" TS error
        // while using your custom next-auth.d.ts definitions
        const sessionUser = session.user as any;
        sessionUser.userId = token.userId;
        sessionUser.tenantId = token.tenantId;
        sessionUser.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};