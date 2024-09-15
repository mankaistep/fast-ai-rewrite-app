/*
  Warnings:

  - You are about to drop the `AgentPrompt` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Activity` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AgentPrompt";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prompt" TEXT,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "result" BOOLEAN NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agentId" INTEGER NOT NULL,
    CONSTRAINT "Activity_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Activity" ("agentId", "id", "input", "output", "prompt", "result", "timestamp") SELECT "agentId", "id", "input", "output", "prompt", "result", "timestamp" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
