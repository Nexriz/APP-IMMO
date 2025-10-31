import { auth } from "@/auth"; // Chemin vers votre fonction d'authentification
import AnnonceForm from "@/components/AnnonceForm"; // Chemin vers le composant de formulaire

export default async function NewAnnoncePage() {
    // 1. Contrôle d'accès côté serveur
    const session = await auth();

    // NOTE: L'objet session.user.Role n'existe qu'après avoir implémenté les callbacks JWT/Session
    // dans votre configuration NextAuth.
    
    // Simulation d'une session et d'un rôle pour le moment
    const userRole = (session?.user as any)?.Role;
    const userId = session?.user?.id;

    if (!session || userRole !== 'AGENT' || !userId) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Accès Refusé</h1>
                <p className="text-gray-600">Seuls les agents immobiliers peuvent accéder à cette page pour créer des annonces.</p>
                <a href="/login" className="mt-4 inline-block text-indigo-600 hover:underline">Se connecter</a>
            </div>
        );
    }

    // Le contrôle d'accès est réussi, afficher le formulaire
    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-2">
                Publier une nouvelle annonce
            </h1>
            {/* Passer l'ID de l'agent au formulaire pour le Server Action */}
            <AnnonceForm mode="create" agentId={userId} />
        </div>
    );
}