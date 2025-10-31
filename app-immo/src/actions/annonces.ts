"use server";

import prisma from "../lib/prisma"; // Chemin vers le client Prisma
import { revalidatePath } from "next/cache";
import { StatutPublication, StatutBien, TypeBien } from '@prisma/client'; // Pour les enums

// NOTE: Dans un environnement réel, les fichiers seraient uploadés vers S3/Vercel Blob.
// Ici, nous simulons l'upload et stockons juste le lien public.

/**
 * Crée une nouvelle annonce immobilière et associe ses photos.
 * @param formData Les données du formulaire soumises par le client.
 */
export async function createAnnonce(formData: FormData) {
    try {
        const titre = formData.get('titre') as string;
        const priceString = formData.get('price') as string;
        const description = formData.get('description') as string;
        const type = formData.get('type') as TypeBien;
        const statutBien = formData.get('statut') as StatutBien;
        const dateDispo = formData.get('dateDispo') as string;
        const agentId = formData.get('agentId') as string;
        const files = formData.getAll('images') as File[];

        const price = parseFloat(priceString);

        // 1. Validation côté serveur
        if (!titre || price <= 0 || !description || !agentId || !dateDispo || !Object.values(TypeBien).includes(type)) {
            return { error: 'Veuillez remplir tous les champs obligatoires correctement.' };
        }
        
        // 2. Création de l'annonce principale
        const nouvelleAnnonce = await prisma.annonce.create({
            data: {
                titre,
                prix: price,
                description,
                type,
                statutBien,
                statutPub: StatutPublication.PUBLIE, // Publiée par défaut
                dateDispo: new Date(dateDispo),
                userId: agentId, 
            }
        });

        // 3. Simulation du traitement des images et création des enregistrements Photo
        const imageData = files
            .filter(file => file.size > 0)
            .map((file, index) => {
                // SIMULATION D'URL : En production, cette URL viendrait de S3/Blob.
                const imageUrl = `/uploads/annonces/${nouvelleAnnonce.id}_${index}_${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
                
                return {
                    url: imageUrl,
                    photoName: file.name,
                    mimeType: file.type || 'application/octet-stream',
                    annonceId: nouvelleAnnonce.id,
                };
            });
        
        if (imageData.length > 0) {
            await prisma.photo.createMany({
                data: imageData
            });
        }

        // 4. Revalidation et succès
        revalidatePath('/annonces');
        return { success: true, annonceId: nouvelleAnnonce.id };

    } catch (e) {
        console.error("Erreur lors de la création de l'annonce:", e);
        return { error: "Une erreur interne est survenue lors de la publication." };
    }
}

/**
 * Supprime une annonce (réservé à l'agent propriétaire).
 * @param annonceId L'ID de l'annonce à supprimer.
 * @param agentId L'ID de l'agent effectuant la suppression.
 */
export async function deleteAnnonce(annonceId: number, agentId: string) {
    try {
        // 1. Vérifiez que l'agent est bien le propriétaire de l'annonce
        const annonce = await prisma.annonce.findUnique({
            where: { id: annonceId },
            select: { userId: true }
        });

        if (!annonce || annonce.userId !== agentId) {
            return { error: "Permission refusée ou annonce introuvable." };
        }

        // 2. Suppression de l'annonce (les photos sont supprimées en cascade si configuré dans la BDD)
        await prisma.annonce.delete({
            where: { id: annonceId },
        });

        // 3. Revalidation
        revalidatePath('/annonces');
        return { success: true };

    } catch (e) {
        console.error("Erreur lors de la suppression de l'annonce:", e);
        return { error: "Erreur serveur lors de la suppression." };
    }
}

/**
 * Met à jour une annonce existante.
 * NOTE: Cette fonction devrait être étendue pour gérer la suppression/ajout de photos existantes.
 */
export async function updateAnnonce(annonceId: number, agentId: string, formData: FormData) {
    // Logique de mise à jour simplifiée pour l'exemple
    
    // 1. Validation de l'ID et de l'agent (similaire à deleteAnnonce)
    const existingAnnonce = await prisma.annonce.findUnique({
        where: { id: annonceId },
    });

    if (!existingAnnonce || existingAnnonce.userId !== agentId) {
        return { error: "Permission refusée ou annonce introuvable." };
    }

    // 2. Mise à jour des champs
    const titre = formData.get('titre') as string;
    const price = parseFloat(formData.get('price') as string);
    // ... autres champs ...

    await prisma.annonce.update({
        where: { id: annonceId },
        data: {
            titre,
            prix: price,
            // ... mise à jour d'autres champs
        }
    });

    revalidatePath(`/annonces/${annonceId}`);
    return { success: true, annonceId };
}