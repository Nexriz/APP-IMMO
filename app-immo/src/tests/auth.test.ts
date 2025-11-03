import * as bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";

describe("Authentification NextAuth", () => {
  beforeAll(async () => {
    const hash = await bcrypt.hash("7894561230", 10);
    await prisma.user.create({
      data: {
        email: "testuser@mail.com",
        password: hash,
        name: "Test User",
        role: "USER",
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test("Test User password incorrect", async () => {
    const session = await signIn({
      email : "testuser@mail.com",
      password : "predicter12" 
    });
    expect(session).toBe(null);
  })
});
