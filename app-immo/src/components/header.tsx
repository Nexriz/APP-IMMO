"use client";

import Link from "next/link";
import LinkAuth from "./LinkAuth";

export default function Header() {
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

                <LinkAuth />

            </div>
        </header>
    );
}