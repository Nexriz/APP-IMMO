/**
 * @jest-environment node
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"; 

const mockAuth = jest.fn();
const mockPrismaFindUnique = jest.fn();
const mockPrismaUpdate = jest.fn();
const mockPrismaDelete = jest.fn();

jest.unstable_mockModule("@/auth", () => ({
  auth: mockAuth,
}));

jest.unstable_mockModule("@/lib/prisma", () => ({
  prisma: {
    annonce: {
      findUnique: mockPrismaFindUnique,
      update: mockPrismaUpdate,
      delete: mockPrismaDelete,
    },
  },
}));

describe("API route /api/annonces/[id]", () => {
    let GET: any, PUT: any, DELETE: any;

    beforeEach(async () => {
        mockAuth.mockClear();
        mockPrismaFindUnique.mockClear();
        mockPrismaUpdate.mockClear();
        mockPrismaDelete.mockClear();

        const routeModule = await import("@/app/api/annonces/[id]/route");
        GET = routeModule.GET;
        PUT = routeModule.PUT;
        DELETE = routeModule.DELETE;
    });

    test("Utilisateur non authentifié renvoie réponse 403", async () => {
        mockAuth.mockReturnValue(null);
        const { req } = createMocks({ method: 'GET' });

        const response = await GET(req as Request, { params: { id: "1" } });

        expect(response.status).toBe(403);
        expect(await response.json()).toEqual({ error: "Non autorisé" });
    })
});