import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {

    //Récupération de tout les utilisateurs
    const users = await prisma.user.findMany({
      select : {
        id : true,
        name : true,
        email : true,
        role : true
      }
    });

    //Vérification si des utilisateurs ont été trouvées dans la bdd
    if(!users){
      return NextResponse.json({error : "Aucun utilisateurs trouvée" }, { status : 404});
    };

    return NextResponse.json(users); //Renvoie de tous les utilisateurs

  } catch (err) {
    return NextResponse.json({ error: "Erreur réseau/serveur" }, { status: 500 });
  };
};

export async function PUT(request : Request){
    try {
        const {id, role} = await request.json(); //récupération de l'id et du rôle de l'utilisateur

        const updateUser = await prisma.user.update({
            where : {
                id : id
            },
            data : {
                role : role
            }
        });

        return NextResponse.json(updateUser); //Renvoie de l'utilisateur avec rôle modifié

    } catch (err){
        return NextResponse.json({error : "Erreur réseau/serveur"}, {status : 500});
    }
};
