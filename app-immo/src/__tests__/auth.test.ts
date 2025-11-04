/**
 * @jest-environment node
 */
import { jest, describe, test, expect, beforeAll, afterAll } from '@jest/globals';

import * as bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { verify } from "@/lib/authCredentialsStyle";

const prisma = new PrismaClient();

describe("Authentification NextAuth", () => {
  const testPassword = "7894561230";
  const testMail = "testuser@mail.com";

  beforeAll(async () => {
    const hash = await bcrypt.hash(testPassword, 10);
    await prisma.user.create({
      data: {
        email: testMail,
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
    const user = await verify({
      email : testMail,
      password : "predicter12" 
    });
    expect(user).toBe(null);
  });

  test("Test User email incorrect", async () => {
    const user = await verify({
      email : "user@mail.com",
      password : testPassword, 
    });
    expect(user).toBe(null);
  });

  test("Test fields missing", async () => {
    const user = await verify({
      email : "testuser@mail.com",
      password : "", 
    });
    expect(user).toBe(null);
  });

  test("Test with identifier correct", async () => {
    const user = await verify({
      email : "testuser@mail.com",
      password : testPassword, 
    });
    expect(user).not.toBe(null);
    expect(user?.email).toBe("testuser@mail.com");
    expect(user?.name).toBe("Test User");
    expect(user?.role).toBe("USER");
  });
});
