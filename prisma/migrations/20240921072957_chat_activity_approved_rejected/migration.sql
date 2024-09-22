/*
  Warnings:

  - You are about to drop the column `result` on the `ChatActivity` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prompt" TEXT,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "approved" BOOLEAN,
    "rejected" BOOLEAN,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agentId" INTEGER NOT NULL,
    CONSTRAINT "ChatActivity_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ChatActivity" ("agentId", "id", "input", "output", "prompt", "timestamp") SELECT "agentId", "id", "input", "output", "prompt", "timestamp" FROM "ChatActivity";
DROP TABLE "ChatActivity";
ALTER TABLE "new_ChatActivity" RENAME TO "ChatActivity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
