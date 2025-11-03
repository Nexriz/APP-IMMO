"use client";

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

// On étend le type Annonce pour inclure les photos
interface AnnonceWithPhoto extends Annonce {
  photo: Photo[];
}

interface AnnonceCardProps {
  annonce: AnnonceWithPhoto;
}

export default function AnnonceCard({ annonce }: AnnonceCardProps) {
  const imageUrl = annonce.photo[0]?.url || '/no-image.jpg';
  
  // Fonction pour formater le prix en Euros
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
      className="block bg-white shadow-xl border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
    >
      
      <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
        <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full ${
          annonce.type === TypeBien.LOCATION ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}>
          {annonce.type === TypeBien.LOCATION ? 'À Louer' : 'À Vendre'}
        </span>
        </div>
      </div>


      <div className="p-8">
        <h2 className="text-xl pt-4 font-bold text-gray-900 mb-1">
          {annonce.titre}
        </h2>
        <p className="text-3xl font-extrabold text-indigo-600 mb-3">
          {formatPrice(annonce.prix)}
        </p>
   
        <p className="text-xs text-gray-400 mt-3 text-right">
            Publié le {new Date(annonce.dateDispo).toLocaleDateString()}
        </p>
      </div>
    </a>
  );
}
