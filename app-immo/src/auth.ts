import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
 
export const { handlers, signIn, signOut, auth } = NextAuth( {
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
            async authorize(credentials) {
                    let user = null
            }
        })
    ],
})