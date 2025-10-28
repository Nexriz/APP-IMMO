'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from 'next/link'

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await signUp("credentials", {
        email,
        password,
      });
    }

}


  return (
    <div className="bg-gray-300 h-screen flex flex-col">
      <header className=" bg-gray-500 p-3 flex items-center justify-center">
        <Link href="/" className="font-bold text-xl text-black hover:text-white">App-Immo</Link>
      </header>
        <main className="flex items-center justify-center flex-grow pb-10 ">
          <div className="p-8 max-w-md mx-auto border bg-white shadow-lg w-full">
          <h1 className="text-xl font-bold mb-4 text-black">Créer votre compte</h1>

          <form onSubmit={handleSignUp} className="flex flex-col space-y-4 text-black">

            <input
              type="text"
              placeholder="Prénom nom (pas obligatoire)"
              className="border p-2 rounded-xl"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email example : merchant@gmail.com"
              className="border p-2 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Mot de passe : *****"
              className="border p-2 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />

            <p className="text-red-600 text-base">{error}</p>

            <button type="submit" className="bg-gray-900 text-white py-2 rounded-xl">
              ENREGISTRER
            </button>

            <p>Vous avez un compte ? <Link href="/login" className="text-blue-800 hover:underline hover:text-blue-500">Connecter-vous</Link> </p>
          </form>
          </div>
        </main>
    </div>
  );
}
