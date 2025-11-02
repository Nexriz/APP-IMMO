import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { content, annonceId } = await req.json();

  if (!content || !annonceId) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  try {
    const question = await prisma.question.create({
      data: {
        content,
        annonceId: Number(annonceId),
        userId: session.user.id,
        userName: session.user.name,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("Erreur création question:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
