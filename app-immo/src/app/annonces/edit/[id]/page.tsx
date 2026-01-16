'use client';

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AnnonceForm from "@/components/AnnonceForm";
import { Loader2, ArrowLeft, ShieldAlert } from "lucide-react";

export default function EditPage(){
    const { data: session, status } = useSession();
    const { id } = useParams();
    const router = useRouter();
    const [annonce, setAnnonce] = useState<any>(null);
    const [error, setError] = useState("");

    const userId = session?.user.id;
    const userRole = session?.user.role;

    useEffect(() => {
        if (status === "unauthenticated") return;
        
        async function getAnnonce() {
            try {
                const res = await fetch(`/api/annonces/${id}`);
                const d = await res.json();

                if(!res.ok){
                    setError(d.error || "Impossible de charger l'annonce.");
                } else {
                    setAnnonce(d);
                }
            } catch (err) {
                setError("Erreur réseau lors de la récupération.");
            }
        }
        getAnnonce();
    }, [id, status]);

    // 1. État de chargement élégant
    if (status === "loading" || (!annonce && !error)) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Récupération des données...</p>
            </div>
        );
    }

    // 2. Gestion des accès non autorisés (sans crasher l'app)
    if (!session || (userRole !== "ADMIN" && userRole !== "AGENT")) {
        return (
            <div className="container mx-auto max-w-md mt-20 p-8 bg-white rounded-3xl shadow-xl border border-red-100 text-center">
                <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-slate-900 mb-2">Accès Restreint</h2>
                <p className="text-slate-500 mb-6">Vous n'avez pas les permissions nécessaires pour modifier cette annonce.</p>
                <button 
                    onClick={() => router.push('/')}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
                >
                    Retour à l'accueil
                </button>
            </div>
        );
    }

    // 3. Page d'édition principale
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <div className="container mx-auto py-12 px-4 max-w-4xl">
                
                {/* Fil d'ariane / Bouton retour */}
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-medium"
                >
                    <ArrowLeft size={18} />
                    Retour à la gestion
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Header de la carte */}
                    <div className="bg-slate-900 p-8 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-500 text-[10px] font-black uppercase px-2 py-0.5 rounded">Mode Édition</span>
                            <span className="text-slate-400 text-xs">ID: #{id}</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">
                            Modifier : <span className="text-blue-400">{annonce.titre}</span>
                        </h1>
                    </div>

                    {/* Zone du formulaire */}
                    <div className="p-8">
                        {error ? (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl mb-6 font-medium">
                                ⚠️ {error}
                            </div>
                        ) : (
                            <AnnonceForm mode="edit" agentId={userId} annonceData={annonce}/>
                        )}
                    </div>
                </div>

                <p className="text-center text-slate-400 text-sm mt-8">
                    Dernière modification détectée le {new Date().toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}