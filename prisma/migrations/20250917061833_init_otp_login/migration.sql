/*
  Warnings:

  - You are about to drop the `AuditCouple` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Couple` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CoupleCheckin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CoupleDateIdea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CoupleEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CoupleJournal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AuditCouple";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Couple";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CoupleCheckin";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CoupleDateIdea";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CoupleEvent";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CoupleJournal";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "EmailCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "id") SELECT "createdAt", "email", "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "EmailCode_userId_code_idx" ON "EmailCode"("userId", "code");
