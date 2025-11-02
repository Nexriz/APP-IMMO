"use client";

import Link from "next/link";
import LinkAuth from "./LinkAuth";
import { useSession } from "next-auth/react";

export default function Header() {
    const { data: session } = useSession();
    const role = session?.user?.role;

    return (
        <header className="bg-blue-500 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                
                {/* Logo */}
                <div className="text-2xl font-bold text-white space-x-3 ">
                    <Link href="/" >ImmobilleteToi</Link>

                    <Link href="/annonces" className="font-bold underline border-l-4 border-white pl-4 hover:text-indigo-200 transition">Annonces</Link>
                </div>
                
                <div className="flex items-center space-x-3">
                    {(role === "AGENT" || role === "ADMIN") && (
                        <>
                            <Link
                                href="/annonces/new"
                                className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition"
                            >
                                Ajouter
                            </Link>
                            <Link
                                href="/annonces/edit"
                                className="bg-black text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
                            >
                                Mes annonces
                            </Link>
                        </>
                    )}
                    {role === "ADMIN" && (
                        <Link
                            href="/admin"
                            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition"
                        >
                            Admin
                        </Link>
                    )}

                    <LinkAuth />
                </div>
            </div>
        </header>
    );
}
