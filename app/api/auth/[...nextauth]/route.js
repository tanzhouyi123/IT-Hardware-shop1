import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "m@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      /**
       * Check if user exists in database with given credentials
       * @param {Object} credentials - Email and password from user
       * @returns {Object} User information if credentials are valid, otherwise throws an error
       * @throws {Error} If user does not exist or credentials are invalid
       */
      async authorize(credentials) {
        // Check if user exists in database
        const users = await query(
          `SELECT 
            user_id,
            first_name,
            last_name,
            phone_number,
            email,
            role
          FROM 
            users 
          WHERE 
            email = ? AND password = ? LIMIT 1`,
          [credentials?.email, credentials?.password]
        );

        if (users.length > 0) {
          const user = users[0];
          return { id: user.user_id, email: user.email, user: user };
        } else {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login", // Custom sign-in page if needed
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.user = user.user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.data = token.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
