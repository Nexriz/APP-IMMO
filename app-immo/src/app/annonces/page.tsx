import { StatutPublication } from '@prisma/client';
import { prisma } from "@/lib/prisma"; 
import AnnonceCard from "@/components/AnnonceCard"; 

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
            <div className="min-h-screen bg-gray-50/50">
                <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="max-w-2xl mb-12">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                            Découvrez nos <span className="text-blue-600">exclusivités</span>
                        </h1>
                        <p className="text-lg text-slate-600">
                            Trouvez le bien de vos rêves parmi nos {annonces.length} annonces.
                        </p>
                    </div>

                    {/* Grid Section */}
                    {annonces.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
                            {annonces.map(annonce => (
                                <div key={annonce.id} className="transition-transform duration-300 hover:-translate-y-2">
                                    <AnnonceCard annonce={annonce as any} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                            <div className="text-6xl mb-4">🏠</div>
                            <h3 className="text-xl font-semibold text-slate-900">Aucune annonce disponible</h3>
                            <p className="text-slate-500">Revenez plus tard pour de nouvelles annonces.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Erreur:", error);
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-50 p-8 rounded-2xl text-center max-w-md border border-red-100">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h2 className="text-red-800 font-bold text-xl mb-2">Service indisponible</h2>
                    <p className="text-red-600/80">Nous rencontrons une difficulté pour accéder à notre catalogue d'annonces. Merci de réessayer plus tard.</p>
                </div>
            </div>
        );
    }
}
