import { prisma } from "@/lib/prisma"; // Chemin relatif vers src/lib/prisma
import ImageGallery from "@/components/ImageGallery"; // Chemin relatif vers src/components/ImageGallery
import QuestionForm from "@/components/QuestionForm"; // Chemin relatif vers src/components/QuestionForm
import { TypeBien, StatutBien } from '@prisma/client'; // Import des enums

interface AnnonceDetailPageProps {
    params: { id: string };
}

export default async function AnnonceDetailPage({ params }: AnnonceDetailPageProps) {
    const annonceId = parseInt(params.id);

    if (isNaN(annonceId)) {
        return <div className="text-center py-20 text-red-500">ID d'annonce invalide.</div>;
    }

    try {
        const annonce = await prisma.annonce.findUnique({
            where: { id: annonceId },
            include: { 
                photo: true, // Photos
                question: true, // Questions
                user: { select: { name: true } } // Agent
            },
        });

        if (!annonce) {
            return <div className="text-center py-20 text-gray-600">Désolé, cette annonce n'existe plus.</div>;
        }

        const isLocation = annonce.type === TypeBien.LOCATION;

        return (
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                
                {/* 1. Titre et Statut */}
                <div className="flex justify-between items-start mb-6 border-b pb-4">
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        {annonce.titre}
                    </h1>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold text-white ${isLocation ? 'bg-green-600' : 'bg-indigo-600'}`}>
                        {isLocation ? 'À Louer' : 'À Vendre'}
                    </span>
                </div>

                {/* 2. Galerie d'images */}
                <ImageGallery 
                    photos={annonce.photo} 
                    titreAnnonce={annonce.titre} 
                />

                <div className="flex flex-col lg:flex-row gap-8 mt-10">
                    
                    {/* 3. Détails de l'Annonce */}
                    <div className="lg:w-2/3">
                        <div className="p-6 bg-white rounded-xl shadow-lg mb-8">
                            <h2 className="text-3xl font-bold text-indigo-700 mb-4">
                                {annonce.prix.toLocaleString('fr-FR')} €
                            </h2>
                            <h3 className="text-xl font-semibold mb-3 border-b pb-2 text-gray-800">Description</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{annonce.description}</p>
                            
                            <div className="mt-6 pt-4 border-t">
                                <p className="text-sm text-gray-500">
                                    Agent responsable : <span className="font-medium text-gray-700">{annonce.user.name || 'Agent Inconnu'}</span>
                                </p>
                                <p className="text-sm text-gray-500">
                                    Date de disponibilité : {annonce.dateDispo.toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        </div>
                        
                        {/* 4. Section Questions/Réponses */}
                        <div className="mt-8">
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Questions ({annonce.question.length})</h3>
                            <div className="space-y-4">
                                {annonce.question.map(q => (
                                    <div key={q.id} className="p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-200">
                                        <p className="font-medium text-gray-700">Q: {q.content}</p>
                                        <div className="mt-2 pl-4 border-l-2 border-indigo-500">
                                            {q.answer ? (
                                                <p className="text-sm text-gray-800">R: {q.answer}</p>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic">En attente de réponse de l'agent...</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* 5. Formulaire pour poser une question */}
                            <QuestionForm annonceId={annonce.id} />
                        </div>

                    </div>
                    
                    {/* 6. Sidebar (pour les statistiques ou actions futures) */}
                    <div className="lg:w-1/3 p-6 bg-white rounded-xl shadow-lg h-fit">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Informations Complémentaires</h3>
                        {/* Ajoutez ici d'autres détails comme la ville, le statut du bien, etc. */}
                        <p className="text-gray-600">Statut du Bien: {annonce.statutBien}</p>
                        <p className="text-gray-600">Type de Transaction: {annonce.type}</p>
                        {/* Bouton de contact pour l'agent (future fonctionnalité) */}
                        <a href="#" className="mt-6 block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition duration-150">
                            Contacter l'Agent
                        </a>
                    </div>

                </div>
            </div>
        );
    } catch (error) {
        console.error("Erreur lors du chargement du détail de l'annonce:", error);
        // Afficher une erreur générique en cas de problème serveur/BDD
        return (
            <div className="text-center py-20 text-red-600">
                Impossible de charger l'annonce. Veuillez réessayer plus tard.
            </div>
        );
    }
}
