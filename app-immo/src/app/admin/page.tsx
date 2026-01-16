"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Loader2, ShieldCheck, Users, Mail, UserCog, AlertCircle } from "lucide-react";

interface User {
    id: number,
    name: string,
    email: string,
    role: string
}

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getUsers() {
            try {
                const res = await fetch(`/api/admin/users`);
                const d = await res.json();
                if (res.ok) setUsers(d);
            } catch (err) {
                console.error("Erreur réseau ", err);
            } finally {
                setLoading(false);
            }
        }
        getUsers();
    }, []);

    // Protection de la route 
    if (status === "loading" || loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-slate-500 font-medium">Chargement du panel admin...</p>
            </div>
        );
    }

    if (!session || session.user.role !== "ADMIN") {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] px-4">
                <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center max-w-md shadow-xl">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Accès Refusé</h1>
                    <p className="text-slate-600">
                        Cette zone est strictement réservée aux administrateurs système.
                    </p>
                </div>
            </div>
        );
    }

    const handleRole = async (id: number, newRole: string) => {
        try {
            const res = await fetch(`/api/admin/users`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, role: newRole }),
            });

            if (!res.ok) throw new Error("Erreur API");

            setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: newRole } : u));
        } catch (err) {
            alert("Erreur lors de la mise à jour");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <div className="max-w-6xl mx-auto pt-12 px-4">
                
                {/* Header du Dashboard */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                            <ShieldCheck className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                Administration
                            </h1>
                            <p className="text-slate-500 font-medium flex items-center gap-2">
                                <Users size={16} /> {users.length} Utilisateurs inscrits
                            </p>
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="py-5 px-8 text-xs font-black uppercase tracking-widest text-slate-400">Utilisateur</th>
                                    <th className="py-5 px-8 text-xs font-black uppercase tracking-widest text-slate-400">Contact</th>
                                    <th className="py-5 px-8 text-xs font-black uppercase tracking-widest text-slate-400">Rôle Actuel</th>
                                    <th className="py-5 px-8 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Changer le Rôle</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                    {user.name?.charAt(0) || "U"}
                                                </div>
                                                <span className="font-bold text-slate-700">{user.name || "Sans nom"}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Mail size={14} />
                                                <span className="text-sm">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter ${
                                                user.role === "ADMIN" ? "bg-red-100 text-red-600" :
                                                user.role === "AGENT" ? "bg-blue-100 text-blue-600" :
                                                "bg-emerald-100 text-emerald-600"
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex justify-center">
                                                <div className="relative group/select w-40">
                                                    <UserCog className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRole(user.id, e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="USER">USER</option>
                                                        <option value="AGENT">AGENT</option>
                                                        <option value="ADMIN">ADMIN</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}