/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `TimelineItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TimelineItem_url_key" ON "TimelineItem"("url");
