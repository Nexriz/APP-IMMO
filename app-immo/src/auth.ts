// src/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { Role } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth( {
    adapter : PrismaAdapter(prisma), //Connexion à la base de donnée

    session :{
        strategy : "jwt", // Utilisation du jeton JWT
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.Role = user.Role;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user && token.Role) {
                session.user.id = token.id;
                session.user.Role = token.Role;
            }
            return session;
  }
    },

    providers : [
        Credentials({
            //Champs que signIn attends
            credentials : {
                email : {
                    type : "email",
                    label : "Adresse Email"
                },
                password : {
                    type : "password",
                    label : "Mot de passe"
                },
            },

            //Fonction éxécutée à l'appel de signIn
            async authorize (credentials) {

                //Vérification des champs obligatoires
                if(!credentials.email || !credentials.password){
                    return null;
                };
                
                //Cherche si l'email est bien dans la base de donnée
                const user = await prisma.user.findUnique({
                    where : {
                        email : credentials.email as string
                    }
                });

                //Vérification si l'utilisateur existe
                if (!user || !user.password) {
                    return null;
                }

                //Vérifie que le mot de passe correspond à celui enregistrer dans la base de donnée
                const PasswordCorrect = await bcrypt.compare(credentials.password as string, user.password);

                //En cas de succès on renvoie l'objet "user"
                if (PasswordCorrect){
                    return {
                        id : user.id,
                        name : user.name,
                        email : user.email,
                        Role : user.Role                        
                    }
                } else {
                    return null;
                };
            }
        })
    ],

    
})