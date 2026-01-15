"use client";

import React, { useState } from 'react';

interface Photo {
  id: number;
  photoName: string | null;
  url: string;
}

interface ImageGalleryProps {
  photos: Photo[] | null;
  titreAnnonce: string;
}

export default function ImageGallery({ photos, titreAnnonce }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="bg-gray-200 h-96 flex items-center justify-center rounded-xl shadow-inner mb-6">
        <p className="text-gray-600 font-medium">Aucune photo disponible pour cette annonce.</p>
      </div>
    );
  }

  const currentPhoto = photos[currentImageIndex];
  const mainImageUrl = currentPhoto.url || `https://placehold.co/1000x600/6366f1/ffffff?text=${titreAnnonce}`;

  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-8">
      
      <div className="lg:w-3/4 relative h-96 bg-gray-200 rounded-xl shadow-xl overflow-hidden">
        <img 
          src={mainImageUrl} 
          alt={currentPhoto.photoName || titreAnnonce} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. Miniatures */}
      <div className="lg:w-1/4 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-96">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => setCurrentImageIndex(index)}
            className={`flex-shrink-0 w-24 h-24 lg:w-full lg:h-24 rounded-lg cursor-pointer transition-all duration-200 ${
              index === currentImageIndex ? 'ring-4 ring-indigo-500 shadow-md' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <img 
              src={photo.url || `https://placehold.co/100x100/6366f1/ffffff?text=Img${index + 1}`} 
              alt={photo.photoName || `Miniature ${index + 1}`} 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
