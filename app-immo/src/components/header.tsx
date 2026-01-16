"use client";

import Link from "next/link";
import Image from "next/image";
import LinkAuth from "./LinkAuth";
import NotificationBell from "./Notification";  
import { useSession } from "next-auth/react";

export default function Header() {
    const { data: session } = useSession();
    const role = session?.user?.role;

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
                    <div className="relative w-10 h-10 shadow-lg rounded-xl overflow-hidden border border-slate-100">
                        <Image 
                            src="/icon.png" 
                            alt="Logo" 
                            fill 
                            className="object-cover"
                        />
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                        App <span className="text-blue-600">Immo</span>
                    </span>
                </Link>
                
                {/* Navigation Section */}
                <div className="flex items-center gap-4">
                    
                    {/* Admin/Agent Actions */}
                    {(role === "AGENT" || role === "ADMIN") && (
                        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl gap-1">
                            <Link
                                href="/annonces/edit"
                                className="text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-white hover:shadow-sm transition-all text-sm"
                            >
                                Mes annonces
                            </Link>
                        </div>
                    )}

                    {/* Admin Badge */}
                    {role === "ADMIN" && (
                        <Link
                            href="/admin"
                            className="bg-red-50 text-red-600 border border-red-100 font-bold py-2 px-4 rounded-xl hover:bg-red-600 hover:text-white transition-all text-sm"
                        >
                            Panel Admin
                        </Link>
                    )}

                    {/* Notification & Auth */}
                    <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                        {session && role && (
                            <div className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
                                <NotificationBell />
                            </div>
                        )}
                        <div className="ml-2">
                            <LinkAuth />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}