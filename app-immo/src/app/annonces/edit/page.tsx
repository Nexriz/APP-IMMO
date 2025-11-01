"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

//Typage pour typescript
interface Annonce {
  id: number;
  titre: string;
}

export default function EditAnnoncesPage() {
    const router = useRouter();
    const [annonces, setAnnonces] = useState<Annonce[]>([]);
    const { data: session, status } = useSession();
  
    const userId = session?.user.id;

    //Permet d'éviter les effets de bords sachant qu'on appelle fetch
    useEffect(() => {
        async function getAnnonces() {
            try {
                const res = await fetch(`/api/annonces/user/${userId}`); //Appel api récupérant tous les annonces de l'utilisateur
                const d = await res.json(); //Récupération de la liste des annonces

                if(!res.ok){
                //Si l'api renvoie une erreur on la récupère et on l'affiche
                console.error("Problème nous n'avons pas trouvées les annonces !", d.error);
                } else {
                    console.log("Annonces trouvées : ", d);
                    setAnnonces(d); //Met a jour la liste des annonces actuelles
                }
            } catch (err) {
                console.error("Erreur réseau ", err);
            }
        }
        getAnnonces(); //appel de la fonction
    }, [userId]);

    //Affichage si la session n'a pas encore été trouvée (en état de chargement)
    if (status === "loading"){
         return <p className="flex items-center justify-center h-screen text-3xl font-bold">Chargement de la page...</p>;
    };

    //Affichage si l'utilisateur n'est pas connecté
    if (!session){
         return <p className="flex items-center justify-center h-screen text-3xl font-bold">Connectez-vous à votre compte avant de pouvoir regardé votre liste d'annonces</p>;
    };

    //Affichage si on attends de l'api la liste des annonces
    if (!annonces){
        return <p className="flex items-center justify-center h-screen text-3xl font-bold">Chargement des annonces...</p>;
    };

    //Affiche une alerte demandant la confirmation de la supression de l'annonce
    const handleDelete = async (id: number) => {
        if (!confirm("Voulez vous vraiment supprimer cette annonce ?")){
            return;
        };

        try {
            //En cas de réponse ok on appel une api qui va supprimer l'annonce de la bdd
            await fetch(`/api/annonces/${id}`, { method: "DELETE" });
            setAnnonces((previous) => previous.filter((annonce) => annonce.id !== id)); //Enlève l'annonce de la liste des annonces
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression");
        }
    };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 border-b pb-2">Mes annonces</h1>
      {annonces.length === 0 && <p>Vous n'avez aucune annonce pour le moment</p>}
      <ul>
        {annonces.map((annonce) => (
          <li key={annonce.id} className="mb-2 flex justify-between items-center border p-2 rounded">
            <span
              className="cursor-pointer text-white"
              onClick={() => router.push(`/annonces/edit/${annonce.id}`)}
            >
              {annonce.titre}
            </span>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => handleDelete(annonce.id)}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
