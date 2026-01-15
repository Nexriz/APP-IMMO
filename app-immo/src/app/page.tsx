export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8 text-center bg-gray-50">
      
      <div className="max-w-4xl w-full">
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
          Trouvez la maison de vos rêves ici et <span className="text-indigo-600">aujourd'hui même</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Découvrez la plateforme la plus simple pour acheter, vendre ou louer des biens immobiliers.
        </p>

        
        <a href="/annonces" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-3 px-8 rounded-xl shadow-lg transform transition duration-300 hover:scale-105">
          Explorer les Annonces
        </a>
      </div>

    </main>
  );
}
