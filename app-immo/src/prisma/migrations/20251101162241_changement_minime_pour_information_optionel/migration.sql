-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Annonce" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'LOCATION',
    "description" TEXT,
    "prix" REAL NOT NULL,
    "statutPub" TEXT NOT NULL DEFAULT 'PUBLIE',
    "statutBien" TEXT NOT NULL,
    "dateDispo" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Annonce_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Annonce" ("dateDispo", "description", "id", "prix", "statutBien", "statutPub", "titre", "type", "userId") SELECT "dateDispo", "description", "id", "prix", "statutBien", "statutPub", "titre", "type", "userId" FROM "Annonce";
DROP TABLE "Annonce";
ALTER TABLE "new_Annonce" RENAME TO "Annonce";
CREATE TABLE "new_Photo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "photoName" TEXT,
    "annonceId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Photo_annonceId_fkey" FOREIGN KEY ("annonceId") REFERENCES "Annonce" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Photo" ("annonceId", "createdAt", "id", "photoName", "url") SELECT "annonceId", "createdAt", "id", "photoName", "url" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
