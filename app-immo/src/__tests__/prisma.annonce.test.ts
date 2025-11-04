import { prisma } from "@/lib/prisma";

describe("Prisma - Vérification des opérations sur Annonce", () => {
  let annonceId: number;
  let userId: string;

  beforeAll(async () => {
    // un utilisateur pour les tests
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "testuser@example.com",
        password: "123456789",
        role: "AGENT",
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    // Nettoyage
    await prisma.annonce.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  it("crée une annonce", async () => {
    const annonce = await prisma.annonce.create({
      data: {
        titre: "Annonce de test",
        description: "Description pout test aussi",
        prix: 1000,
        statutBien: "DISPONIBLE",
        userId,
      },
    });
    annonceId = annonce.id;

    expect(annonce).toHaveProperty("id");
    expect(annonce.titre).toBe("Annonce de test");
    expect(annonce.userId).toBe(userId);
  });

  it("lire une annonce par ID", async () => {
    const annonce = await prisma.annonce.findUnique({
      where: { id: annonceId },
    });
    expect(annonce).not.toBeNull();
    expect(annonce?.titre).toBe("Annonce de test");
  });

  it("mettre à jour une annonce", async () => {
    const updated = await prisma.annonce.update({
      where: { id: annonceId },
      data: { prix: 1500 },
    });
    expect(updated.prix).toBe(1500);
  });

  it("supprime une annonce", async () => {
    const deleted = await prisma.annonce.delete({
      where: { id: annonceId },
    });
    expect(deleted.id).toBe(annonceId);

    // on verifie que l'annonce n'existe plus
    const findDeleted = await prisma.annonce.findUnique({
      where: { id: annonceId },
    });


    expect(findDeleted).toBeNull();
  });



  it("liste toutes les annonces", async () => {
    // Crée deux annonces
    await prisma.annonce.createMany({
      data: [
        { titre: "A1", prix: 100, statutBien: "DISPONIBLE", userId },
        { titre: "A2", prix: 200, statutBien: "DISPONIBLE", userId },
      ],
    });

    const annonces = await prisma.annonce.findMany()

    expect(annonces.length).toBeGreaterThanOrEqual(2)

    expect(annonces.map(a => a.titre)).toEqual(expect.arrayContaining(["A1", "A2"]) );
  });
});
