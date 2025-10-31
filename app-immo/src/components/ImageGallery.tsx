"use client";

import React, { useState } from 'react';

// Définition de type basée sur le schéma Prisma (simplifiée)
interface Photo {
  id: number;
  data: string; // Stocké en base64 pour la démo, ou un URL si vous utilisez un service de stockage
  photoName: string;
}

interface ImageGalleryProps {
  photos: Photo[];
  titreAnnonce: string;
}

export default function ImageGallery({ photos, titreAnnonce }: ImageGalleryProps) {
  if (!photos || photos.length === 0) {
    return (
      <div className="bg-gray-200 h-96 flex items-center justify-center rounded-xl shadow-inner mb-6">
        <p className="text-gray-600 font-medium">Aucune photo disponible pour cette annonce.</p>
      </div>
    );
  }

  // Stocke l'index de la photo actuellement affichée
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentPhoto = photos[currentImageIndex];

  // Comme nous n'avons pas de véritable système d'upload, on utilise une couleur
  // pour représenter l'image (pour l'affichage statique).
  const imageDisplay = currentPhoto.data ? `data:image/jpeg;base64,${currentPhoto.data}` : `https://placehold.co/1000x600/6366f1/ffffff?text=${titreAnnonce}`;


  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-8">
      
      {/* 1. Image principale */}
      <div className="lg:w-3/4 relative h-96 bg-gray-200 rounded-xl shadow-xl overflow-hidden">
        {/* On utilise une balise img simple ou un div pour contourner les erreurs next/image */}
        <div 
          className="w-full h-full bg-cover bg-center transition-all duration-300"
          style={{ 
            backgroundImage: `url(${imageDisplay})`,
            // Simulation d'une photo réelle si aucune donnée n'est fournie
            backgroundColor: currentPhoto.data ? undefined : 'rgb(99, 102, 241, 0.5)',
          }}
          aria-label={`Photo principale de ${currentPhoto.photoName}`}
        >
          {!currentPhoto.data && (
            <div className="flex items-center justify-center h-full text-white text-3xl font-bold p-4">
              {titreAnnonce}
            </div>
          )}
        </div>
      </div>
      
      {/* 2. Miniatures */}
      <div className="lg:w-1/4 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-96">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => setCurrentImageIndex(index)}
            className={`flex-shrink-0 w-24 h-24 lg:w-full lg:h-24 rounded-lg cursor-pointer transition-all duration-200 ${
              index === currentImageIndex ? 'ring-4 ring-indigo-500 shadow-md' : 'opacity-70 hover:opacity-100'
            } bg-gray-100`}
            style={{ 
              backgroundImage: `url(https://placehold.co/100x100/6366f1/ffffff?text=Img${index + 1})`,
              backgroundSize: 'cover' 
            }}
            aria-label={`Miniature ${index + 1}`}
          >
            {/* Contenu pour simuler l'image */}
          </div>
        ))}
      </div>
    </div>
  );
}