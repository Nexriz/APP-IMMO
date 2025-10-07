-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "Role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Annonce" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prix" REAL NOT NULL,
    "statutpub" TEXT NOT NULL DEFAULT 'PUBLIE',
    "statubien" TEXT NOT NULL,
    "datedispo" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Session" (
    "sessioncookie" TEXT NOT NULL PRIMARY KEY,
    "userid" TEXT NOT NULL,
    "expirationdate" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" BLOB NOT NULL,
    "mimetype" TEXT NOT NULL,
    "photoname" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "answer" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_AnnonceToPhoto" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AnnonceToPhoto_A_fkey" FOREIGN KEY ("A") REFERENCES "Annonce" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AnnonceToPhoto_B_fkey" FOREIGN KEY ("B") REFERENCES "Photo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AnnonceToQuestion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AnnonceToQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "Annonce" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AnnonceToQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SessionToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SessionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Session" ("sessioncookie") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SessionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessioncookie_key" ON "Session"("sessioncookie");

-- CreateIndex
CREATE UNIQUE INDEX "_AnnonceToPhoto_AB_unique" ON "_AnnonceToPhoto"("A", "B");

-- CreateIndex
CREATE INDEX "_AnnonceToPhoto_B_index" ON "_AnnonceToPhoto"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AnnonceToQuestion_AB_unique" ON "_AnnonceToQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_AnnonceToQuestion_B_index" ON "_AnnonceToQuestion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SessionToUser_AB_unique" ON "_SessionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SessionToUser_B_index" ON "_SessionToUser"("B");
