import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface EditAnnoncePageProps {
    params: { 
        id: string 
    };
}

export async function GET(request : Request, { params } : EditAnnoncePageProps ){
    try {

        //Récupération de l'annonce correspondante 
        const annonce = await prisma.annonce.findUnique({
            where : {
                id : parseInt(params.id)
            }
        });

        //Vérification si l'annonce a été trouvée dans la bdd
        if(!annonce){
            return NextResponse.json({error : "L'annonce n'a pas été trouvée" }, { status : 404});
        };

        return NextResponse.json(annonce); //Renvoie de l'annonce correspondante

    } catch (err) {
        return NextResponse.json({error : "Erreur réseau/serveur" }, { status : 500});
    };
};

export async function PUT(request : Request, { params } : EditAnnoncePageProps ){
    try {
        const annonceData = await request.json(); //Récupération de la requête contenant l'annonce

        //Vérification si l'annonce a bien été récupérer
        if(!annonceData){
            return NextResponse.json({error : "Annonce introuvable"}, {status : 404});
        }

        //Update de l'annonce selon les nouvelles valeurs
        const annonceUpdate = await prisma.annonce.update({
            where : {
                id : parseInt(params.id)
            },

            data : {
                titre : annonceData.titre,
                description : annonceData.description,
                prix : annonceData.prix,
                type : annonceData.type,
                statutBien : annonceData.statutBien,
                dateDispo : annonceData.dateDispo,
                photo : annonceData.photo
            }
        });
        
        return NextResponse.json(annonceUpdate); //Renvoie de l'annonce mise à jour

    } catch (err){
        return NextResponse.json({error : "Erreur Réseau/Serveur ou Annonce non trouvée"}, {status : 500});
    }
};

export async function DELETE(request : Request, { params }: EditAnnoncePageProps) {
  try {
    //Supression de l'annonce ayant l'id correspondant à la demande
    await prisma.annonce.delete({
        where: { 
            id: parseInt(params.id)
        },
    });

    return NextResponse.json({ message: "Annonce supprimée avec succès" }); //Revoie du message 

  } catch (err) {
    return NextResponse.json({ error: "Erreur lors de la suppression de l'annonce" }, { status: 500 });
  }
};