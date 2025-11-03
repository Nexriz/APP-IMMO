import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { questionId } = await req.json();

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { annonce: { include: { user: true } } },
    });

    if (!question) return NextResponse.json({ error: "Question introuvable" }, { status: 404 });

    const isOwner = question.annonce.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin)
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

    await prisma.question.delete({ where: { id: questionId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur suppression question:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
