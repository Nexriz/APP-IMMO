import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcrypt";

export async function verify(credentials: Partial<Record<"email" | "password", unknown>>){
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
};