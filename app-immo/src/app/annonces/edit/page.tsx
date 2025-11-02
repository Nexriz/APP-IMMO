"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Annonce {
  id: number;
  titre: string;
}

export default function EditAnnoncesPage() {
  const router = useRouter();
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const { data: session, status } = useSession();
  
  const userId = session?.user.id;
  const userRole = session?.user.role;

  useEffect(() => {
    async function getAnnonces() {
      try {
        const url = userRole === "ADMIN" ? `/api/admin/annonces` : `/api/annonces/user/${userId}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
          console.error("Problème, annonces non trouvées !", data.error);
        } else {
          setAnnonces(data);
        }
      } catch (err) {
        console.error("Erreur réseau", err);
      }
    }
    getAnnonces();
  }, [userId, userRole]);

  if (status === "loading") {
    return <p className="flex items-center justify-center h-screen text-3xl font-bold">Chargement de la page...</p>;
  }

  if (!session) {
    return <p className="flex items-center justify-center h-screen text-3xl font-bold">Connectez-vous pour voir vos annonces</p>;
  }

  if (!annonces) {
    return <p className="flex items-center justify-center h-screen text-3xl font-bold">Chargement des annonces...</p>;
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;

    try {
      await fetch(`/api/annonces/${id}`, { method: "DELETE" });
      setAnnonces((prev) => prev.filter((annonce) => annonce.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 border-b pb-2">
        {userRole === "ADMIN" ? "Toutes les annonces" : "Mes annonces"}
      </h1>

      {annonces.length === 0 && (
        <p className="text-gray-500 text-center py-10">Vous n'avez aucune annonce pour le moment</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {annonces.map((annonce) => (
          <div
            key={annonce.id}
            className="flex flex-col justify-between bg-white rounded-xl shadow-md hover:shadow-xl transition p-4"
          >
            <span
              className="text-lg font-semibold cursor-pointer text-indigo-600 hover:text-indigo-800 transition"
              onClick={() => router.push(`/annonces/edit/${annonce.id}`)}
            >
              {annonce.titre}
            </span>

            <button
              className="mt-3 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
              onClick={() => handleDelete(annonce.id)}
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
