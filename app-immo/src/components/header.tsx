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
                
                </nav>

                <div className="flex space-x-4 items-center">
                    {(role === "AGENT" || role === "ADMIN") && (
                        <div className="flex space-x-3 mr-3">
                            <a 
                                href="/annonces/new" 
                                className="bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-600 transition duration-150"
                            >Ajouter une annonce
                            </a>
                            <a href="/annonces/edit" 
                                className="bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-150"
                            >Gérer mes annonces
                            </a>
                        </div>
                    )}
                    <div className="flex space-x-3 mr-3">
                        {(role === "ADMIN") && (
                            <a href="/admin" className="bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow hover:bg-red-600 transition duration-150"
                            >
                                Admin roles
                            </a>
                        )}
                    </div>
                </div>
                <LinkAuth />
                
            </div>
            
        </header>
    );
}