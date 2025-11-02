import { StatutPublication } from '@prisma/client';
import { prisma } from "@/lib/prisma"; 
import AnnonceCard from "@/components/AnnonceCard"; 


const STATUT_PUBLIE = 'PUBLIE' as any; 

export default async function AnnoncesPage() {
    try {
        // 1. Récupération des données 
        const annonces = await prisma.annonce.findMany({
            include: { photo: true },
            where: {
                statutPub: StatutPublication.PUBLIE,
            },
            orderBy: { dateDispo: 'desc' },
        });

        return (
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-white mb-8 border-b pb-4">
                    Découvrez toutes nos annonces immobilières
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {annonces.map(annonce => (
                        // On passe l'annonce complète à la carte
                        <AnnonceCard key={annonce.id} annonce={annonce as any} /> 
                    ))}
                </div>
                
                {annonces.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-inner">
                        <p className="text-xl text-gray-600">Aucune annonce publiée pour le moment</p>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        // En cas d'erreur de BDD ou de Prisma, afficher un message clair
        console.error("Erreur lors du chargement des annonces:", error);
        return (
            <div className="text-center py-20 text-red-600">
                Erreur de chargement. Veuillez vérifier la connexion à la base de données et les dépendances.
            </div>
        );
    }
}
