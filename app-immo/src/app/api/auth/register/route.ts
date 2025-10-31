
//Import
import  prisma  from "@/lib/prisma";
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const {name, email, password } = await request.json(); //Récupération des données entrée par l'utilisateur

        //Vérification si on a bien les données obligatoires
        if(!email || !password){
            return NextResponse.json({error : "Donnée manquante"}, {status : 400});
        };

        //Vérification si l'email existe déja
        if( await prisma.user.findUnique({ where : {email : email} })) {
            return NextResponse.json({error : "Cet email est déja utilisée"}, {status : 409});
        }

        //Hachage du mot de passe
        const HashPassword = await bcrypt.hash(password , 10);

        //Création de l'utilisateur dans la base de donnée
        const user = await prisma.user.create({
            data : {
                name : name,
                email : email,
                password : HashPassword
            }
        });
        
        //On récupère tous les données sauf le mot de passe pour ensuite envoyer (question de sécurité)
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({user : userWithoutPassword}, { status : 201});

    } catch (err) {
        return NextResponse.json({error : "Problème lors de l'inscription"}, {status : 500}); //Le serveur a rencontré un problème inattendu
    }
}