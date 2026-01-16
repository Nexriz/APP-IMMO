"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Trash2, Edit3, Plus, Building2 } from "lucide-react";

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
      if (!userId) return;
      try {
        const url = userRole === "ADMIN" ? `/api/admin/annonces` : `/api/annonces/user/${userId}`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) setAnnonces(data);
      } catch (err) {
        console.error("Erreur réseau", err);
      }
    }
    getAnnonces();
  }, [userId, userRole]);

  // États de chargement stylisés
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Chargement de votre espace...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Accès restreint</h2>
        <p className="text-slate-500 mt-2">Veuillez vous connecter pour gérer vos annonces.</p>
      </div>
    );
  }

  const handleDelete = async (id: number) => {
    if (!confirm("⚠️ Cette action est irréversible. Supprimer l'annonce ?")) return;

    try {
      const res = await fetch(`/api/annonces/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAnnonces((prev) => prev.filter((annonce) => annonce.id !== id));
      }
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="container mx-auto pt-12 px-4 sm:px-6">
        
        {/* Header du Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                Espace {userRole}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">
              {userRole === "ADMIN" ? "Gestion globale" : "Mes propriétés"}
            </h1>
          </div>
          
          <button 
            onClick={() => router.push('/annonces/new')}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} />
            Nouvelle annonce
          </button>
        </div>

        {/* Liste des annonces */}
        {annonces.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center">
            <Building2 className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium text-lg">Aucune annonce trouvée.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map((annonce) => (
              <div
                key={annonce.id}
                className="group bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-200"
              >
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {annonce.titre}
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">ID: #{annonce.id}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => router.push(`/annonces/edit/${annonce.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold py-2.5 rounded-lg transition-colors"
                  >
                    <Edit3 size={16} />
                    Modifier
                  </button>
                  
                  <button
                    onClick={() => handleDelete(annonce.id)}
                    className="aspect-square flex items-center justify-center bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}