import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface UserAnnoncesProps {
  params: {
    userId: string;
  };
}

export async function GET(request: Request, { params }: UserAnnoncesProps) {
  try {
    const userId = parseInt(params.userId);

    //Récupération de toutes les annonces appartenant à l'userId
    const annonces = await prisma.annonce.findMany({
      where: {
        userId : params.userId,
      },
    });

    //Vérification si les annonces ont été trouvées dans la bdd
    if(!annonces){
      return NextResponse.json({error : "Les annonces n'ont pas été trouvées" }, { status : 404});
    }

    return NextResponse.json(annonces); //Renvoie de tous les annonces

  } catch (err) {
    return NextResponse.json({ error: "Erreur réseau/serveur" }, { status: 500 });
  }
}
