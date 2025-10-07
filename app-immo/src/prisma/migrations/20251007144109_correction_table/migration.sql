/*
  Warnings:

  - You are about to drop the `_AnnonceToPhoto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AnnonceToQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SessionToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `datedispo` on the `Annonce` table. All the data in the column will be lost.
  - You are about to drop the column `statubien` on the `Annonce` table. All the data in the column will be lost.
  - You are about to drop the column `statutpub` on the `Annonce` table. All the data in the column will be lost.
  - You are about to drop the column `mimetype` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `photoname` on the `Photo` table. All the data in the column will be lost.
  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expirationdate` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `sessioncookie` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `Session` table. All the data in the column will be lost.
  - Added the required column `statutBien` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annonceId` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photoName` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annonceId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationDate` to the `Session` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Session` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `sessionCookie` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_AnnonceToPhoto_B_index";

-- DropIndex
DROP INDEX "_AnnonceToPhoto_AB_unique";

-- DropIndex
DROP INDEX "_AnnonceToQuestion_B_index";

-- DropIndex
DROP INDEX "_AnnonceToQuestion_AB_unique";

-- DropIndex
DROP INDEX "_SessionToUser_B_index";

-- DropIndex
DROP INDEX "_SessionToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_AnnonceToPhoto";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_AnnonceToQuestion";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_SessionToUser";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Annonce" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prix" REAL NOT NULL,
    "statutPub" TEXT NOT NULL DEFAULT 'PUBLIE',
    "statutBien" TEXT NOT NULL,
    "dateDispo" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Annonce_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Annonce" ("description", "id", "prix", "titre", "type") SELECT "description", "id", "prix", "titre", "type" FROM "Annonce";
DROP TABLE "Annonce";
ALTER TABLE "new_Annonce" RENAME TO "Annonce";
CREATE TABLE "new_Photo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" BLOB NOT NULL,
    "mimeType" TEXT NOT NULL,
    "photoName" TEXT NOT NULL,
    "annonceId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Photo_annonceId_fkey" FOREIGN KEY ("annonceId") REFERENCES "Annonce" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Photo" ("createdAt", "data", "id") SELECT "createdAt", "data", "id" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "answer" TEXT,
    "annonceId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Question_annonceId_fkey" FOREIGN KEY ("annonceId") REFERENCES "Annonce" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("answer", "content", "createdAt", "id") SELECT "answer", "content", "createdAt", "id" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionCookie" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expirationDate" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_sessionCookie_key" ON "Session"("sessionCookie");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
