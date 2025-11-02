import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcrypt";


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

        //Vérification si l'utilisateur a bien rentré un mot de passe et un email
        if (!credentials.email || !credentials.password){
           return null;
        };

        //On cherche l'utilisateur dans la bdd
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        console.log("Found user in DB: ", user);

        //Vérification si l'utilisateur existe et qu'il a bien un mot de passe
        if (!user || !user.password){
           return null;
        };

        //On compare le mot de passe entrée avec celui stockée dans la bdd (mot de passe haché dans la bdd)
        const isValid = await bcrypt.compare(credentials.password as string, user.password as string);
        //En cas de mot de passe invalide la connexion est refusée
        if (!isValid) {
           return null;
        };

        //Si mot de passe et email correcte on renvoie les informations de l'utilisateur stockée dans le token JWT
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