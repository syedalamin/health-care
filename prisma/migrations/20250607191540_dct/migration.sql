/*
  Warnings:

  - You are about to drop the column `starDateTime` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `startDateTime` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "starDateTime",
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL;
