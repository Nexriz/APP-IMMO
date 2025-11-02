"use client";

import React, { useState, useTransition, useRef } from 'react';
import { createAnnonce, updateAnnonce } from '../actions/annonces'; // Chemin relatif vers Server Action
import { StatutBien, Annonce } from '@prisma/client'; // Import des types Prisma
import { useRouter } from 'next/navigation';

// Définition des types pour le mode édition
interface AnnonceWithPhotos extends Annonce {
    photo: { id: number; url: string; photoName: string }[];
}

interface AnnonceFormProps {
    mode: 'create' | 'edit';
    agentId: string;
    annonceData?: AnnonceWithPhotos; // Optionnel pour l'édition
}

export default function AnnonceForm({ mode, agentId, annonceData }: AnnonceFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);

    // Initialisation des valeurs pour l'édition ou la création
    const initialData = {
        titre: annonceData?.titre || '',
        description: annonceData?.description || '',
        price: annonceData?.prix || 0,
        statut: annonceData?.statutBien || StatutBien.DISPONIBLE,
    };

    // Gère la soumission du formulaire
    const handleSubmit = async (formData: FormData) => {
        setError(null);

        // Ajouter les fichiers au FormData
        files.forEach(file => {
            formData.append('images', file, file.name);
        });
        
        // Ajouter l'ID de l'agent
        formData.append('agentId', agentId);
        
        startTransition(async () => {
            const action = mode === 'create' ? createAnnonce : updateAnnonce;
            
            const result = await action(formData); 
            
            if (result.error) {
                setError(result.error);
            } else if (result.success) {
                router.push(`/annonces/${result.annonceId}`);
            }
        });
    };

    // Gère le drag & drop des fichiers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
        const selectedFiles = e.type === 'change' 
            ? Array.from((e.target as HTMLInputElement).files || [])
            : Array.from((e as React.DragEvent<HTMLDivElement>).dataTransfer.files || []);
        
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    };
    
    // Gère la suppression d'une image en attente
    const removeFile = (name: string) => {
        setFiles(prevFiles => prevFiles.filter(file => file.name !== name));
    };

    return (
        <form action={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
            
            {/* -------------------- Message d'erreur -------------------- */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Erreur:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Titre */}
                <div>
                    <label htmlFor="titre" className="block text-sm font-medium text-gray-700">Titre de l'annonce</label>
                    <input
                        type="text"
                        name="titre"
                        id="titre"
                        defaultValue={initialData.titre}
                        required
                        className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm p-3"
                    />
                </div>
                
                {/* Prix */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix (€)</label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        min="0"
                        className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm p-3"
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description détaillée</label>
                <textarea
                    name="description"
                    id="description"
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm p-3"
                />
            </div>

            {/* -------------------- Sélecteurs et Date -------------------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Type de Bien */}
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type de bien</label>
                    <select
                        name="type"
                        id="type"
                        defaultValue={"LOCATION"}
                        className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm p-3"
                    >
                        <option value={"VENTE"}>VENTE</option>
                        <option value={"LOCATION"}>LOCATION</option>
                    </select>
                </div>
                 {/* Statut du Bien */}
                <div>
                    <label htmlFor="statut" className="block text-sm font-medium text-gray-700">Statut du bien</label>
                    <select
                        name="statut"
                        id="statut"
                        defaultValue={initialData.statut}
                        className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm p-3 "
                    >
                        <option value={"DISPONIBLE"}>DISPONIBLE</option>
                        <option value={"LOUE"}>LOUE</option>
                        <option value={"VENDU"}>VENDU</option>
                    </select>
                </div>
                 {/* Date de disponibilité */}
                 <div>
                    <label htmlFor="dateDispo" className="block text-sm font-medium text-gray-700">Date de disponibilité</label>
                    <input
                        type="date"
                        name="dateDispo"
                        id="dateDispo"
                        required
                        className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm p-3"
                    />
                </div>
            </div>

            {/* -------------------- Upload des Images -------------------- */}
            <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Photos de l'annonce</h3>
                
                {/* Zone de Drag & Drop / Clic */}
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); handleFileChange(e); }}
                    onClick={() => document.getElementById('file-upload-input')?.click()}
                    className="flex justify-center items-center h-40 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition duration-150"
                >
                    <p className="text-gray-500">Glissez-déposez vos images ici, ou cliquez pour sélectionner.</p>
                </div>
                <input
                    id="file-upload-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {/* Prévisualisation des images en attente */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {files.map((file, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                            <img src={URL.createObjectURL(file)} alt={`Prévisualisation ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeFile(file.name)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 leading-none text-xs hover:bg-red-600 transition"
                                aria-label="Supprimer l'image"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    {mode === 'edit' && annonceData?.photo?.map(p => (
                    <div key={p.id} className="relative aspect-video rounded-lg overflow-hidden border-2 border-green-500 shadow-md">
                        <img src={p.url} alt={`Image existante`} className="w-full h-full object-cover" />
                    <div className="absolute top-0 left-0 bg-green-500 text-white px-2 py-0.5 text-xs font-bold">Existante</div>
                </div>
            ))}

                </div>
            </div>

            {/* -------------------- Bouton de soumission -------------------- */}
            <button
                type="submit"
                disabled={isPending}
                className={`w-full py-3 rounded-md font-semibold text-white transition duration-200 ${
                    isPending ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'
                }`}
            >
                {isPending 
                    ? `Soumission en cours...` 
                    : mode === 'create' ? 'Publier l\'Annonce' : 'Sauvegarder les modifications'}
            </button>
        </form>
    );
}