"use client";

const LinkAuth = () => {
    // "Se déconnecter" ou "Se connecter / S'inscrire" selon l'état d'authentification
    const isAuthenticated = false; 

    return (
        <div className="flex space-x-4">
            {isAuthenticated ? (
                <button className="text-white hover:text-red-300">Se déconnecter</button>
            ) : (
                <>
                    {/* Liens de connexion/inscription remplacés par <a> */}
                    <a href="/login" className="text-white hover:text-indigo-200 transition duration-150">
                        Se connecter
                    </a>
                    <a href="/signup" className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition duration-150">
                        S'inscrire
                    </a>
                </>
            )}
        </div>
    );
};

export default function Header() {
    return (
        <header className="bg-indigo-800 shadow-xl sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                
                <div className="text-2xl font-extrabold text-white">
                    <a href="/">
                        🏡 ImmoApp
                    </a>
                </div>
                
                <nav className="hidden md:flex space-x-8 items-center">
                    <a href="/annonces" className="text-white hover:text-indigo-200 font-medium transition duration-150">
                        Annonces
                    </a>
                
                </nav>

                <LinkAuth />

            </div>
        </header>
    );
}