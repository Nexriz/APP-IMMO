import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
     const session = await auth();
      if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Non autorisé, vous n'êtes pas l'administrateur" }, { status: 403 });
      };

    //Récupération de toutes les annonces dans l'odre des dates de dispo
    const annonces = await prisma.annonce.findMany({
        orderBy : {
            dateDispo : 'desc'
        }
    });

    //Vérification si aucune annonces n'ont été trouvées dans la bdd
    if(!annonces){
      return NextResponse.json({error : "Aucune annonces n'ont été trouvées" }, { status : 404});
    }

    return NextResponse.json(annonces); //Renvoie de tous les annonces de la bdd

  } catch (err) {
    return NextResponse.json({ error: "Erreur réseau/serveur" }, { status: 500 });
  }
}