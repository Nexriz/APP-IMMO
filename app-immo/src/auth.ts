import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcrypt';

export const { handlers, signIn, signOut, auth } = NextAuth( {
    adapter : PrismaAdapter(prisma),

    providers : [
        Credentials({
            credentials : {
                email : {
                    type : "email",
                    label : "Adresse Email",
                    placeholder : "merchant@gmail.com"
                },
                password : {
                    type : "password",
                    label : "Mot de passe",
                    placeholder : "IdrissDu76*"
                },
            },
            async authorize (credentials) {
                if((credentials.email || credentials.password) == false){
                    return null;
                };
            
                const user = await prisma.user.findUnique({
                    where : {
                        email : credentials.email as string
                    }
                });

                if (!user){
                    return null;
                };

                const PasswordCorrect = await bcrypt.compare(credentials.password as string, user.password);

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