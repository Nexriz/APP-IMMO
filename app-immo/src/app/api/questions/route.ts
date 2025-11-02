import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { content, annonceId } = await req.json();

  const question = await prisma.question.create({
    data: {
      content,
      annonceId,
      userId: session.user.id, // lié à l'utilisateur connecté
    },
  });

  return NextResponse.json(question);
}

export async function PUT(req: Request) {
  const session = await auth();

  if (!session || session.user.role === "USER") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { questionId, answer } = await req.json();

  const updated = await prisma.question.update({
    where: { id: questionId },
    data: { answer },
  });

  return NextResponse.json(updated);
}
