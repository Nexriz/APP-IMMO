import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { Role } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { 
    strategy: "jwt"  // Utilisation de la stratégie du JWT
  },

  providers: [
    Credentials({
      credentials: {
        email: { 
          label: "Email", 
          type: "text" 
        },
        password: { 
          label: "Mot de passe", 
          type: "password" 
        },
      },

      async authorize(credentials) {
        if (!credentials.email || !credentials.password){
           return null;
        };

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        console.log("Found user in DB: ", user);

        if (!user || !user.password){
           return null;
        };

        const isValid = await bcrypt.compare(credentials.password as string, user.password as string);
        if (!isValid) {
           return null;
        };

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        console.log("JWT token created:", token);
      }
      return token;
    },
  },

  pages: {
    signIn: "/login",
  },
});