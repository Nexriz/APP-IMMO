'use client';

import { useSession } from "next-auth/react"
import AnnonceForm from "@/components/AnnonceForm";

export default function NewAnnoncePage() {
    const { data: session, status } = useSession();

    const userRole = session?.user.role;
    const userId = session?.user.id;

    if (userRole !== "ADMIN" && userRole !== "AGENT") {
        throw new Error("Accès refusé : seuls les ADMIN et AGENT peuvent créer une annonce.");
    }

    if (status === "loading") {
        return <p className="flex items-center justify-center h-screen text-3xl font-bold">Chargement de la page...</p>;
    };

    

    if (!session || userRole !== 'AGENT' && userRole !== 'ADMIN'||  !userId) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-3xl font-bol text-red-600 mb-4">Accès Refusé</h1>
                <p className="text-gray-600">Seuls les agents immobiliers peuvent accéder à cette page pour créer une annonce. Si vous l'ếtes connectez-vous à votre compte</p>
                <a href="/login" className="mt-4 inline-block text-indigo-600 hover:underline">Se connecter</a>
            </div>
        );
    }

    // Le contrôle d'accès est réussi, afficher le formulaire
    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <h1 className="text-3xl font-bold text-white mb-8 border-b pb-2">
                Publier votre nouvelle annonce
            </h1>
            <AnnonceForm mode="create" agentId={userId} />
        </div>
    );
}