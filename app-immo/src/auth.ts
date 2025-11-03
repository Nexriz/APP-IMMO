import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {verify} from "@/lib/authCredentialsStyle"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { 
    strategy: "jwt"  // Utilisation de la stratégie du JWT
  },

  //Providers (un seul système de connexion ici)
  providers: [
    Credentials({
      //Champs attendu pour se connecter
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

      //Appel lorsque un utilisateur essaye de se connecter
      async authorize(credentials) {
        return verify(credentials);
      },
    }),
    
  ],

  callbacks: {
    //Appel de la fonction lorsque un token est créer ou mise à jour
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        console.log("JWT token created:", token);
      }
      return token; //Stock du token JWT coté client
    },

    //Appel de la fonction lorsque on essaye de récupérer les informations de la session coté client
    async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id;
      session.user.role = token.role; 
    }
    return session; // On renvoie la session
  },
  },
  //Indication de la page de connexion
  pages: {
    signIn: "/login",
  },
});