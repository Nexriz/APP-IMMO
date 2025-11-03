import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { content, annonceId } = await req.json();

  // Création de la question
  const question = await prisma.question.create({
    data: {
      content,
      annonce: { connect: { id: annonceId } },
      user: { connect: { id: session.user.id } },
    },
    include: { annonce: { include: { user: true } } },
  });

  // Créer une notification pour l’agent responsable de l’annonce
  if (question.annonce.user?.id) {
    await prisma.notification.create({
      data: {
        message: `Nouvelle question posée sur votre annonce "${question.annonce.titre}".`,
        userId: question.annonce.user.id,
      },
    });
  }

  return NextResponse.json(question);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session || session.user.role === "USER") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { questionId, answer } = await req.json();

  // Vérifie que la question existe
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { annonce: true, user: true },
  });

  if (!question) {
    return NextResponse.json({ error: "Question introuvable" }, { status: 404 });
  }

  // Mise à jour de la réponse
  const updated = await prisma.question.update({
    where: { id: questionId },
    data: { answer },
  });

  // Créer une notification pour le user qui a posé la question
  if (question.user?.id) {
    await prisma.notification.create({
      data: {
        message: `Votre question sur "${question.annonce.titre}" a reçu une réponse.`,
        userId: question.user.id,
      },
    });
  }

  return NextResponse.json(updated);
}
