"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function LinkAuth() {
  const { data: session, status } = useSession();

  // En attente du chargement
  if (status === "loading") {
    return <p className="text-white">deconnexion...</p>;
  }

  // Si l'utilisateur est connecté
  if (session?.user) {
    return (
      <div className="flex space-x-4 items-center">
        <span className="text-purple ">Bonjour {session.user.name} , {session.user.role}  </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-white hover:text-red-300 transition duration-150"
        >
          Se déconnecter
        </button>
      </div>
    );
  }

  // Sinon (non connecté)
  return (
    <div className="flex space-x-4">
      <Link
        href="/login"
        className="text-white hover:text-indigo-200 transition duration-150"
      >
        Se connecter
      </Link>
      <Link
        href="/register"
        className="text-white hover:underline hover:text-green-500"
      >
        S'inscrire
      </Link>
    </div>
  );
}
