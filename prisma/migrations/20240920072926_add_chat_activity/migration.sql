-- CreateTable
CREATE TABLE "ChatActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prompt" TEXT,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "result" BOOLEAN NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agentId" INTEGER NOT NULL,
    CONSTRAINT "ChatActivity_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
