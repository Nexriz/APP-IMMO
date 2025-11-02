"use client";

import Link from "next/link";

export default function LoginRequiredPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">
          Accès réservé aux membres
        </h1>
        <p className="text-gray-600 mb-8">
          Pour consulter les détails d’une annonce, vous devez être connecté à votre compte
        </p>

        <div className="flex flex-col space-y-3">
          <Link
            href="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition duration-150"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg transition duration-150"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
