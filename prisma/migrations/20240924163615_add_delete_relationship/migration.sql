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
    "chatActivityId" TEXT,
    CONSTRAINT "Activity_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Activity_chatActivityId_fkey" FOREIGN KEY ("chatActivityId") REFERENCES "ChatActivity" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Activity" ("agentId", "chatActivityId", "id", "input", "output", "prompt", "result", "timestamp") SELECT "agentId", "chatActivityId", "id", "input", "output", "prompt", "result", "timestamp" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
CREATE UNIQUE INDEX "Activity_chatActivityId_key" ON "Activity"("chatActivityId");
CREATE TABLE "new_ChatActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prompt" TEXT,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "approved" BOOLEAN,
    "rejected" BOOLEAN,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agentId" INTEGER NOT NULL,
    CONSTRAINT "ChatActivity_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChatActivity" ("agentId", "approved", "id", "input", "output", "prompt", "rejected", "timestamp") SELECT "agentId", "approved", "id", "input", "output", "prompt", "rejected", "timestamp" FROM "ChatActivity";
DROP TABLE "ChatActivity";
ALTER TABLE "new_ChatActivity" RENAME TO "ChatActivity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
