/*
  Warnings:

  - A unique constraint covering the columns `[chatActivityId]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Activity_chatActivityId_key" ON "Activity"("chatActivityId");
