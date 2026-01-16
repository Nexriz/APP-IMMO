'use client';

import { useSession } from "next-auth/react";
import AnnonceForm from "@/components/AnnonceForm";
import Link from "next/link";
import { Loader2, PlusCircle, ShieldAlert, ArrowLeft } from "lucide-react";

export default function NewAnnoncePage() {
    const { data: session, status } = useSession();

    const userRole = session?.user.role;
    const userId = session?.user.id;

    // 1. État de chargement élégant
    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Initialisation de l'éditeur...</p>
            </div>
        );
    };

    // 2. Gestion des accès non autorisés (Style Card)
    if (!session || (userRole !== "ADMIN" && userRole !== "AGENT")) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center">
                    <div className="bg-red-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-3">Accès réservé</h1>
                    <p className="text-slate-500 leading-relaxed mb-8">
                        Cette interface est réservée aux agents immobiliers certifiés. 
                        Veuillez vous connecter avec un compte autorisé pour publier.
                    </p>
                    <Link 
                        href="/api/auth/signin" 
                        className="block w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
                    >
                        Se connecter
                    </Link>
                </div>
            </div>
        );
    }

    // 3. Interface de création principale
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <div className="container mx-auto py-12 px-4 max-w-4xl">
                
                {/* Navigation de retour */}
                <Link 
                    href="/annonces/edit" 
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-semibold w-fit"
                >
                    <ArrowLeft size={20} />
                    Retour à mes annonces
                </Link>

                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                    {/* Header stylisé */}
                    <div className="bg-blue-600 p-10 text-white relative overflow-hidden">                        
                        <div className="relative z-10">
                            <h1 className="text-4xl font-black tracking-tight mb-2">
                                Nouvelle Annonce
                            </h1>
                            <p className="text-blue-100 font-medium max-w-md">
                                Remplissez les détails ci-dessous pour publier votre annonce.
                            </p>
                        </div>
                    </div>

                    {/* Zone du formulaire avec padding généreux */}
                    <div className="p-10">
                        <AnnonceForm mode="create" agentId={userId} />
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 text-slate-400 text-sm">
                    <span className="flex items-center gap-2">✓ Publication instantanée</span>
                    <span className="flex items-center gap-2">✓ Photos HD illimitées</span>
                    <span className="flex items-center gap-2">✓ Visibilité maximale</span>
                </div>
            </div>
        </div>
    );
}