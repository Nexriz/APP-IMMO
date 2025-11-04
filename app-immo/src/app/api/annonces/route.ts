import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || (user.role !== "ADMIN" && user.role !== "AGENT")) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await request.json();

    const nouvelleAnnonce = await prisma.annonce.create({
      data: {
        titre: body.titre,
        description: body.description,
        prix: body.prix,
        type: body.type,
        statutBien: body.statutBien,
        dateDispo: body.dateDispo,
        photo: body.photo,
        userId: user.id,
      },
    });

    return NextResponse.json(nouvelleAnnonce, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur lors de la création de l’annonce" },
      { status: 500 }
    );
  }
}
