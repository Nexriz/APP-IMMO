'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { SignIn } from "../login";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Identifiants incorrects");
    } else {
      window.location.href = "/Home"; // Rediriger après login réussi
    }
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          Se connecter
        </button>
      </form>
    </main>
  );
}
