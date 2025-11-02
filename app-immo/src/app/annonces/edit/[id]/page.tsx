'use client';

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AnnonceForm from "@/components/AnnonceForm";

export default function EditPage(){
    const { data: session, status } = useSession();
    const { id } = useParams();
    const [annonce, setAnnonce] = useState() ;

    const userId = session?.user.id;

    //Permet d'éviter les effets de bords sachant qu'on appelle fetch
    useEffect(() => {
        async function getAnnonce() {
            try {
                const res = await fetch(`/api/annonces/${id}`); //appel api récupérant l'annonce
                const d = await res.json(); //Récupération de l'annonce

                if(!res.ok){
                //Si l'api renvoie une erreur on la récupère et on l'affiche
                console.error("Problème nous n'avons pas trouvée l'annonce !", d.error);
                } else {
                    console.log("Annonce trouvée : ", d);
                    setAnnonce(d); //Met a jour l'annonces actuelle
                }
            } catch (err) {
                console.error("Erreur réseau ", err);
            }
        }
        getAnnonce(); //appel de la fonction
    }, [id]);

    //Affichage si la session n'a pas encore été trouvée (en état de chargement)
    if (status === "loading"){
        return <p className="flex items-center justify-center h-screen text-3xl font-bold">Chargement de la page...</p>;
    };

    //Affichage si l'utilisateur n'est pas connecté
    if (!session){
        return <p className="flex items-center justify-center h-screen text-3xl font-bold">Connectez-vous à votre compte avant de pouvoir modifié l'annonce</p>;
    };

    //Affichage si on attends de l'api la liste des annonces
    if (!annonce){
        return <p className="flex items-center justify-center h-screen text-3xl font-bold">Chargement de l’annonce...</p>;
    };

    //Vérification si l'utilisateur est un admin ou si l'annonce lui appartient alors il a accès sinon l'accès est refusé
    if (session.user.id !== annonce.userId && session.user.role !== "ADMIN") {
        return <p className="flex items-center justify-center h-screen text-3xl font-bold">Accès refusé</p>;
    };

    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <h1 className="text-3xl font-bold text-white mb-8 border-b pb-2">
                Modifier votre annonce : {annonce.titre}
            </h1>
            <AnnonceForm mode="edit" agentId={userId} annonceData={annonce}/>
        </div>
    );
}