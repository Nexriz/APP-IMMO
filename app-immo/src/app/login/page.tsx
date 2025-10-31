'use client';

//Import
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from 'next/link'
import { useRouter } from "next/navigation";

export default function LoginPage() {
  //États
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 

  const route = useRouter(); // Utilisé pour la redirection vers d'autres pages

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault(); //Évite de recharger la page
    setError('');
    try {
      //Appel de la fonction signIn en utilisant le provider credentials
      const res = await signIn("credentials", {
        email,
        password,
        redirect : false //évite de recharger ou changer de page directement
      });

      if(res.error){
        //Mise à jour du message d'erreur en cas de réponse null de la part de signIn
        setError("Email ou mot de passe incorrect");
      } else if (res.ok){
        route.push("/"); //Redirige vers la page d'accueil
      }

    } catch (err) {
      setError("La connexion à échoué"); //Erreur de réseau
    }
}

  return (
    <div className="bg-gray-300 h-screen flex flex-col">
      <header className=" bg-gray-500 p-3 flex items-center justify-center">
        <Link href="/" className="font-bold text-xl text-black hover:text-white">App-Immo</Link>
      </header>
        <main className="flex items-center justify-center flex-grow pb-10 ">
          <div className="p-8 max-w-md mx-auto border bg-white shadow-lg w-full">
          <h1 className="text-xl font-bold mb-4 text-black">Entrez vos identifiants de connexion</h1>

          <form onSubmit={handleLogin} className="flex flex-col space-y-4 text-black">
            <input
              type="email"
              placeholder="Email example : merchant@gmail.com"
              className="border p-2 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Mot de passe : *****"
              className="border p-2 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <p className="text-red-600 text-base">{error}</p>

            <button type="submit" className="bg-gray-900 text-white py-2 rounded-xl">
              SE CONNECTER
            </button>
            

            <p>Vous n'avez pas de compte ? <Link href="/register" className="text-blue-800 hover:underline hover:text-blue-500">Inscrivez-vous</Link> </p>
          </form>
          </div>
        </main>
    </div>
  );
}