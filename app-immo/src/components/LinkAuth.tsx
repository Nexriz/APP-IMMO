"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, User, LogIn, UserPlus, Loader2 } from "lucide-react";

export default function LinkAuth() {
  const { data: session, status } = useSession();

  // État de chargement discret
  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
        <Loader2 size={16} className="animate-spin" />
        <span>Vérification...</span>
      </div>
    );
  }

  // Utilisateur connecté
  if (session?.user) {
    return (
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-sm font-black text-slate-900 leading-none">
            {session.user.name}
          </span>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            {session.user.role}
          </span>
        </div>
        
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 rounded-xl font-bold transition-all text-sm group"
        >
          <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
          Déconnexion
        </button>
      </div>
    );
  }

  // Non connecté (Appels à l'action clairs)
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold px-4 py-2 rounded-xl transition-colors text-sm"
      >
        <LogIn size={16} />
        Connexion
      </Link>
      
      <Link
        href="/register"
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-100 text-sm active:scale-95"
      >
        <UserPlus size={16} />
        S'inscrire
      </Link>
    </div>
  );
}