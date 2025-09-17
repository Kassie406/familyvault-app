-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Couple" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partnerAId" TEXT NOT NULL,
    "partnerBId" TEXT NOT NULL,
    "settings" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Couple_partnerAId_fkey" FOREIGN KEY ("partnerAId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Couple_partnerBId_fkey" FOREIGN KEY ("partnerBId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoupleDateIdea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "coupleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "estCost" INTEGER,
    "estTimeMinutes" INTEGER,
    "prep" TEXT,
    "createdById" TEXT,
    "upvotes" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoupleDateIdea_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CoupleDateIdea_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoupleEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "coupleId" TEXT NOT NULL,
    "ideaId" TEXT,
    "title" TEXT NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "type" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'couple',
    CONSTRAINT "CoupleEvent_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CoupleEvent_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "CoupleDateIdea" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoupleJournal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "coupleId" TEXT NOT NULL,
    "occurred_on" DATETIME NOT NULL,
    "text" TEXT,
    "media_urls" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoupleJournal_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CoupleJournal_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoupleCheckin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "coupleId" TEXT NOT NULL,
    "at" DATETIME NOT NULL,
    "rating" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "CoupleCheckin_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CoupleCheckin_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditCouple" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "coupleId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditCouple_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuditCouple_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
