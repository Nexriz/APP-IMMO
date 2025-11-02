import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {

    //Récupération de toutes les annonces appartenant à l'userId et dans l'odre des dates de dispo
    const annonces = await prisma.annonce.findMany({
        orderBy : {
            dateDispo : 'desc'
        }
    });

    //Vérification si des annonces ont été trouvées dans la bdd
    if(!annonces){
      return NextResponse.json({error : "Aucune annonces n'ont été trouvées" }, { status : 404});
    }

    return NextResponse.json(annonces); //Renvoie de tous les annonces de la bdd

  } catch (err) {
    return NextResponse.json({ error: "Erreur réseau/serveur" }, { status: 500 });
  }
}