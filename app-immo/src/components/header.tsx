"use client";

import Link from "next/link";
import LinkAuth from "./LinkAuth";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
    const { data: session } = useSession();

    const role = session?.user?.role;


    return (
        <header className="bg-indigo-800 shadow-xl sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                
                <div className="text-2xl font-extrabold text-white">
                    <a href="/">
                        Immobillete toi 
                    </a>
                </div>
                
                <nav className="hidden md:flex space-x-8 items-center">
                    <Link href="/annonces" className="text-white hover:text-indigo-200 font-medium transition duration-150">
                        Annonces
                    </Link>

                    {(role === "AGENT" || role === "ADMIN") 
                    && (
                        <Link href="/annonces/new" className="bg-green-600 px-3 py-1 rounded hover:bg-green-700">
                            Ajouter une annonce
                        </Link>
                        )}
                
                </nav>

                <LinkAuth />

            </div>
        </header>
    );
}