"use server";

import {prisma } from "../lib/prisma"; // Chemin vers le client Prisma
import { revalidatePath } from "next/cache";
import { StatutPublication, StatutBien, TypeBien } from '@prisma/client'; // Pour les enums
import path from "path";
import fs from "fs";

/**
 * Crée une nouvelle annonce immobilière et associe ses photos.
 * @param formData Les données du formulaire soumises par le client.
 */
export async function createAnnonce(formData: FormData) {
  try {
    const titre = formData.get("titre") as string;
    const price = parseFloat(formData.get("price") as string);
    const description = formData.get("description") as string;
    const type = formData.get("type") as TypeBien;
    const statutBien = formData.get("statut") as StatutBien;
    const dateDispo = formData.get("dateDispo") as string;
    const agentId = formData.get("agentId") as string;
    const files = formData.getAll("images") as File[];

    // Vérification champs obligatoires
    if (!titre || !agentId || price <= 0 || !StatutBien || !dateDispo) {
      return { error: "Veuillez remplir tous les champs obligatoires correctement." };
    }

    //Création de l'annonce
    const annonce = await prisma.annonce.create({
      data: {
        titre : titre,
        prix: price,
        description : description,
        type : type,
        statutBien : statutBien,
        statutPub: StatutPublication.PUBLIE,
        dateDispo: new Date(dateDispo),
        userId: agentId,
      },
    });

    // Sauvegarde du fichier dans un dossier local
    const uploadDir = path.join(process.cwd(), "public/uploads/annonces");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const imageData = [];

    for (const [index, file] of files.entries()) {
      if (file.size === 0) continue;

      const safeName = file.name.replace(/[^a-z0-9.]/gi, "_");
      const filePath = path.join(uploadDir, `${annonce.id}_${index}_${safeName}`);

      const bytes = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, bytes);

      imageData.push({
        url: `/uploads/annonces/${annonce.id}_${index}_${safeName}`,
        photoName: file.name,
        annonceId: annonce.id,
      });
    }

    if (imageData.length > 0) {
      await prisma.photo.createMany({ data: imageData });
    }

    revalidatePath("/annonces");
    return { success: true, annonceId: annonce.id };
  } catch (e) {
    console.error("Erreur lors de la création de l'annonce:", e);
    return { error: "Une erreur interne est survenue lors de la publication." };
  }
}

/**
 * Met à jour une annonce existante et gère les nouvelles photos.
 * NOTE: La suppression des anciennes photos devrait être gérée ici aussi.
 */
export async function updateAnnonce(formData: FormData) {
    try {
        const annonceId = parseInt(formData.get('annonceId') as string);
        const titre = formData.get('titre') as string;
        const price = parseFloat(formData.get('price') as string);
        const description = formData.get('description') as string;
        const type = formData.get('type') as TypeBien;
        const statutBien = formData.get('statut') as StatutBien;
        const dateDispo = formData.get('dateDispo') as string;
        const agentId = formData.get('agentId') as string;
        const files = formData.getAll('images') as File[];


        const annonceMiseAJour = await prisma.annonce.update({
            where: { id: annonceId, userId: agentId },
            data: {
                titre,
                prix: price,
                description,
                type,
                statutBien,
                dateDispo: new Date(dateDispo),
            }
        });

       
        const imageData = files
            .filter(file => file.size > 0)
            .map((file, index) => {
                const imageUrl = `/uploads/annonces/${annonceMiseAJour.id}_new_${index}_${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
                
                return {
                    url: imageUrl,
                    photoName: file.name,
                    annonceId: annonceMiseAJour.id,
                };
            });
        
        if (imageData.length > 0) {
            await prisma.photo.createMany({
                data: imageData
            });
        }

        // 3. Revalidation et succès
        revalidatePath(`/annonces/${annonceId}`);
        return { success: true, annonceId: annonceMiseAJour.id };

    } catch (e) {
        console.error("Erreur lors de la mise à jour de l'annonce:", e);
        return { error: "Une erreur interne est survenue lors de la mise à jour." };
    }
}