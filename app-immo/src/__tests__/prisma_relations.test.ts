import { prisma } from "@/lib/prisma";
// Tests pour vérifier les relations entre les modèles Prisma


describe("Prisma - Vérification des relations", () => {
    
  let userId: string;
  let annonceId: number;
  let questionId: number;

  beforeAll(async () => {
    // Création d'un utilisateur qui a rolle agent
    const user = await prisma.user.create({
      data: {
        name: "Agent Test",
        email: "idriss@test.com",
        password: "idriss0120120",
        role: "AGENT",
      }
    });
    userId = user.id

    // Création d'une annonce liée à l'agent  pour les liens avec question

    const annonce = await prisma.annonce.create({
      data: {
        titre: "Annonce Test",
        description: "Description test",
        prix: 1000,
        statutBien: "DISPONIBLE",
        userId: userId,
      }
    })

    annonceId = annonce.id

    // Création d'une question liée à l'annonce
    const question = await prisma.question.create({
      data: {
        content: "Question sur l'annonce",
        userId: userId,
        annonceId: annonceId,
      },
    });
    questionId = question.id
  });

  it("vérifie que l'annonce est liée à l'agent", async () => {
    const annonce = await prisma.annonce.findUnique({
      where: { id: annonceId },

      include: { user: true }, 
    })

    expect(annonce).not.toBeNull()

    expect(annonce?.user.id).toBe(userId)
    
    expect(annonce?.user.role).toBe("AGENT")
  });



  it("vérifie que la question est liée à l'annonce", async () => {
    const question = await prisma.question.findUnique({
      where: { id: questionId },

      include: { annonce: true }, 
    })
    expect(question).not.toBeNull()
    expect(question?.annonce.id).toBe(annonceId)
    expect(question?.annonce.titre).toBe("Annonce Test")
  });

  it("vérifie qu'on peut récupérer toutes les questions d'une annonce", async () => {
    const annonceWithQuestions = await prisma.annonce.findUnique({
      where: { id: annonceId },

      include: { question: true },
    });
    expect(annonceWithQuestions).not.toBeNull()
    expect(annonceWithQuestions?.question.length).toBeGreaterThanOrEqual(1)
    expect(annonceWithQuestions?.question[0].content).toBe("Question sur l'annonce")
  });
});
