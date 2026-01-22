import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }


  const { content, annonceId } = await req.json();

  if (!content || !content.trim() || !annonceId) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  };

  const annonce = await prisma.annonce.findUnique({
      where: { id: annonceId },
      select: { userId: true, titre: true }
  });

  if (!annonce) {
      return NextResponse.json({ error: "Annonce introuvable" }, { status: 404 });
  }

  const question = await prisma.question.create({
    data: {
      content,
      annonceId,
      userId: session.user.id,
    },
  });

  await prisma.notification.create({
    data: {
      message: `Nouvelle question sur "${annonce.titre}" de ${session.user.name}.`,
      userId: annonce.userId,
      },
  });

  return NextResponse.json(question);
}