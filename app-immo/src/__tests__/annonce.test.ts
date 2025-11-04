import { PrismaClient, StatutBien } from "@prisma/client";

const prisma = new PrismaClient();

let annonceId: number;

beforeAll(async () => {
    
  

  // faire  un user test pour les annonces 
  await prisma.user.create({
    data: {
      id: "user-test-id",
      email: "test@example.com",
      password: "hashedpassword",
      role: "AGENT",
    },
  });
});



describe("CRUD Annonces", () => {
  it("crée une annonce", async () => {
    const annonce = await prisma.annonce.create({
      data: {
        titre: "Test annonce",
        description: "annonce de test, pas encore officciel",
        prix: 1200,
        statutBien: StatutBien.DISPONIBLE,
        userId: "user-test-id",
      },
    });

    annonceId = annonce.id;

    expect(annonce).toHaveProperty("id");

    expect(annonce.titre).toBe("Test annonce");

  });

  it("lire une annonce", async () => {
    const annonce = await prisma.annonce.findUnique({
      where: { id: annonceId }
    });

    expect(annonce).not.toBeNull();
    expect(annonce?.description).toBe("annonce de test, pas encore officciel");
  });

  it("mettre à jour une annonce", async () => {
    const updated = await prisma.annonce.update({
      where: { id: annonceId },
      data: { prix: 100500 }
    });

    expect(updated.prix).toBe(100500);
  });

  it("on supprime une annonce", async () => {

    const supprimeAnnonce = await prisma.annonce.delete({
      where: { id: annonceId },
    });

    expect(supprimeAnnonce.id).toBe(annonceId);
  });

  
});

//pour eviter le warning, donc faut deconnecter prisma a la fin des tests

afterAll(async () => {
  await prisma.$disconnect();
});
