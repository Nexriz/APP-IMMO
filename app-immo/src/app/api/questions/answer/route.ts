import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Vérifie que l’utilisateur est connecté
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userRole = session.user.role;
    if (userRole !== "ADMIN" && userRole !== "AGENT") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { questionId, answer } = await req.json();

    if (!questionId || !answer.trim()) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        user: true,
        annonce: { include: { user: true } },
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Question introuvable" }, { status: 404 });
    }

    if (
      session.user.role !== "ADMIN" &&
      session.user.id !== question.annonce.userId
    ) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Vérifie que l’utilisateur est un agent (ou admin)
    if (session.user.role === "USER") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Met à jour la réponse dans la base
    await prisma.question.update({
      where: { id: questionId },
      data: { answer },
    });

    await prisma.notification.create({
    data: {
      message: `Votre question sur "${question.annonce.titre}" a reçu une réponse.`,
      userId: question.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur API /questions/answer :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
