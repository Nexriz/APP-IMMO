"use client";
import { Calendar, Tag, Home } from "lucide-react";


enum TypeBien {
  VENDU = 'VENDU',
  LOCATION = 'LOCATION',
}

interface Photo {
  id: number;
  photoName: string;
  url : string;
}

interface Annonce {
  id: number;
  titre: string;
  type: TypeBien;
  description: string;
  prix: number;
  dateDispo: Date;
}

interface AnnonceWithPhoto extends Annonce {
  photo: Photo[];
}

interface AnnonceCardProps {
  annonce: AnnonceWithPhoto;
}

export default function AnnonceCard({ annonce }: AnnonceCardProps) {
  const imageUrl = annonce.photo[0]?.url || '/no-image.jpg';
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    });
  };

  return (
    <a 
      href={`/annonces/${annonce.id}`} 
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
    >
      {/* Container Image */}
      <div className="relative h-64 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        
        {/* Overlay dégradé pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge Type de Bien */}
        <div className="absolute top-4 left-4">
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${
            annonce.type === TypeBien.LOCATION 
              ? 'bg-blue-600 text-white' 
              : 'bg-emerald-500 text-white'
          }`}>
            <Tag size={12} />
            {annonce.type === TypeBien.LOCATION ? 'Location' : 'Vente'}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {annonce.titre}
          </h2>
        </div>

        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-black text-gray-900">
            {formatPrice(annonce.prix)}
          </span>
          {annonce.type === TypeBien.LOCATION && (
            <span className="text-sm text-gray-500 font-medium">/ mois</span>
          )}
        </div>

        {/* Séparateur */}
        <div className="h-px w-full bg-gray-100 my-4" />

        <div className="flex items-center justify-between text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <span>Dispo : {new Date(annonce.dateDispo).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-1 font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
            Voir plus →
          </div>
        </div>
      </div>
    </a>
  );
}