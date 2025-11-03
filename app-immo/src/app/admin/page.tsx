'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface User {
    id : number,
    name : string,
    email : string,
    role : string
}

export default function AdminPage(){
    const [users, setUsers] = useState<User[]>([]);
    const { data: session, status } = useSession();

    useEffect(() => {
        async function getUsers() {
            try {
                const res = await fetch(`/api/admin/users`); //Appel api récupérant tous les utilisateurs
                const d = await res.json(); //Récupération de la liste des utilisateurs
    
                if(!res.ok){
                    //Si l'api renvoie une erreur on la récupère et on l'affiche
                    console.error(d.error);
                } else {
                    console.log("Liste d'utilisateurs : ", d);
                    setUsers(d); //Met a jour la liste des utilisateurs actuelles
                }
            } catch (err) {
                console.error("Erreur réseau ", err);
            }
        }
        getUsers(); //appel de la fonction
    }, []);
    console.log(users);

    //Vérification que l'utilisateur a bien une session et qu'il a le rôle d'admin
    if (!session || session.user.role !== "ADMIN") {
        return (
        <p className="flex items-center justify-center h-screen text-2xl font-semibold text-red-500">
            Accès refusé — réservé seulement aux administrateurs
        </p>
        );
    }

    //Appel à chaque changement de rôle dans le panneau admin
    const handleRole = async (id: number, newRole : string) => {
        try {
            //Appel API pour changer le rôle de l'utilisateur 
            const res = await fetch(`/api/admin/users`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    id : id,
                    role: newRole 
                }),
            });

            //Si la réponse recu de L'API n'est pas bonne on throw une erreur
            if(!res.ok){
                throw new Error("Erreur API, aucune réponse");
            };

            setUsers((previous) => previous.map((user) => 
                user.id === id ? {...user, role : newRole} : user //Change le rôle de l'utilisateurs dans la liste
            ));

        } catch (err) {
            console.error(err);
            alert("Erreur lors de la mise à jour du rôle");
        }
    };

    return (
    <div className="max-w-5xl mx-auto mt-12 bg-gray-900 rounded-lg shadow-lg border border-gray-700 p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">
        Gestion rôles des utilisateurs
      </h1>

      {users.length === 0 ? (
        <p className="text-gray-400 text-center">Aucun utilisateur trouvé.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="py-3 px-4 border-b border-gray-700">Nom</th>
              <th className="py-3 px-4 border-b border-gray-700">Email</th>
              <th className="py-3 px-4 border-b border-gray-700">Rôle</th>
              <th className="py-3 px-4 border-b border-gray-700 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-800 transition-colors duration-200"
              >
                <td className="py-3 px-4 border-b border-gray-700">
                  {user.name || "—"}
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  {user.email}
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-red-500/20 text-red-400"
                        : user.role === "AGENT"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 border-b border-gray-700 text-center">
                  <select
                    value={user.role}
                    onChange={(e) => handleRole(user.id, e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USER">USER</option>
                    <option value="AGENT">AGENT</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}