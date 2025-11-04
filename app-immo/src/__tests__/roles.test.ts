import { prisma } from "@/lib/prisma";

const testPassword = "7894561230";
  const testMail = "testuser@mail.com";

// Simule trois utilisateurs avec des rôles différents
const admin = {
  id: "admin1",
  name: "Admin",
  email: "admin@test.com",
  password: "123456",
  role: "ADMIN",
};
const agent = {
  id: "agent1",
  name: "Agent",
  email: "agent@test.com",
  password: "123456",
  role: "AGENT",
};
const user = {
  id: "user1",
  name: "User",
  email: "user@test.com",
  password: "123456",
  role: "USER",
};

describe("Restrictions d’accès selon le rôle", () => {
  let annonceId: number;
  let questionId: number;

  

  beforeAll(async () => {
    await prisma.$connect();

    // On crée les utilisateurs simulés
    await prisma.user.createMany({
        data: [admin, agent, user]
    });

    // L'admin crée une annonce
    const annonce = await prisma.annonce.create({
      data: {
        titre: "Maison de test",
        description: "Belle maison",
        prix: 1000,
        statutBien: "DISPONIBLE",
        userId: admin.id,
      },
    });

    annonceId = annonce.id;

    // Le user pose une question
    const question = await prisma.question.create({
      data: {
        content: "Est-ce encore disponible l'annonce la ?",
        userId: user.id,
        annonceId: annonce.id,
      },
    });

    questionId = question.id;
  });

  // tester qu' un USER ne peut pas publier une annonce
  it("refuse la création d’annonce par un USER", async () => {
    let errorCaught = false;
    try {
      await prisma.annonce.create({
        data: {
          titre: "Test interdit",
          description: "Essai user",
          prix: 500,
          statutBien: "DISPONIBLE",
          userId: user.id, 
        },
      });
    } catch {
      errorCaught = true;
    }
    expect(errorCaught).toBe(true);
  });

  

  // tester qu' un ADMIN peut tout faire
  it("permet à un ADMIN de créer une annonce", async () => {
    const annonce = await prisma.annonce.create({
      data: {
        titre: "Villa admin",
        description: "Villa admin test",
        prix: 2000,
        statutBien: "DISPONIBLE",
        userId: admin.id,
      },
    });
    expect(annonce.titre).toBe("Villa admin");
  });

  // tester que un AGENT peut répondre à une question
  it("permet à un AGENT de répondre à une question", async () => {
    const updated = await prisma.question.update({
      where: { id: questionId },
      data: { answer: "Oui, toujours disponible" },
    });
    expect(updated.answer).toBe("Oui, toujours disponible");
  });

  // tester que un USER ne peut pas répondre à une question
  it("refuse qu’un USER réponde à une question", async () => {
    let errorCaught = false;
    try {
      await prisma.question.update({
        where: { id: questionId },
        data: { answer: "Je suis user et je réponds" },
      });
    } catch {
      errorCaught = true;
    }
    expect(errorCaught).toBe(true);
  });

  afterAll(async () => {
    await prisma.question.deleteMany();
    await prisma.annonce.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
});
