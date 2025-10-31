// src/components/AnnonceCard.tsx
"use client"; // Le Link ne fonctionnant pas, nous utilisons un a cliquable, donc client side

// Définition des types locaux pour éviter l'importation de @prisma/client côté client
// Ces types doivent correspondre aux enums de votre schema.prisma (Annonce, Photo, TypeBien)
enum TypeBien {
  VENDU = 'VENDU',
  LOCATION = 'LOCATION',
}

interface Photo {
  id: number;
  photoName: string;
}

interface Annonce {
  id: number;
  titre: string;
  type: TypeBien;
  description: string;
  prix: number;
  dateDispo: Date;
}

// On étend le type Annonce pour inclure les photos
interface AnnonceWithPhoto extends Annonce {
  photo: Photo[];
}

interface AnnonceCardProps {
  annonce: AnnonceWithPhoto;
}

export default function AnnonceCard({ annonce }: AnnonceCardProps) {
  // Utilisez l'URL pour la première photo ou une image par défaut
  // NOTE: Votre schéma stocke les photos en "Bytes" (méthode non optimale pour le web)
  // Pour l'affichage, on simule une URL basée sur le nom de la photo.
  const imageUrl = annonce.photo[0]?.photoName ? `/api/photos/${annonce.photo[0].id}` : '/placeholder.jpg';
  
  // Fonction pour formater le prix en Euros
  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    });
  };

  return (
    // Utilisation de <a> pour remplacer Link (solution temporaire au problème de compilation)
    <a 
      href={`/annonces/${annonce.id}`} 
      className="block bg-white shadow-xl rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
    >
      
      {/* 1. Image de l'annonce */}
      <div className="relative w-full h-48 bg-gray-200">
        {/* Ici, on devrait utiliser un composant Image de Next.js si le problème d'import était résolu */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          {/* Tag Type de Bien */}
          <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full ${
            annonce.type === TypeBien.LOCATION ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
          }`}>
            {annonce.type === TypeBien.LOCATION ? 'À Louer' : 'À Vendre'}
          </span>
        </div>
      </div>

      {/* 2. Contenu de la carte */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 truncate mb-1">
          {annonce.titre}
        </h2>
        <p className="text-3xl font-extrabold text-indigo-600 mb-3">
          {formatPrice(annonce.prix)}
        </p>
        <p className="text-sm text-gray-500 line-clamp-2">
          {annonce.description}
        </p>
        
        <p className="text-xs text-gray-400 mt-3 text-right">
            Publié le {new Date(annonce.dateDispo).toLocaleDateString()}
        </p>
      </div>
    </a>
  );
}
