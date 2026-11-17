/*
  Warnings:

  - You are about to drop the `CommentReaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentReaction" DROP CONSTRAINT "CommentReaction_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentReaction" DROP CONSTRAINT "CommentReaction_userId_fkey";

-- DropTable
DROP TABLE "CommentReaction";

-- CreateTable
CREATE TABLE "NewsRating" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsReaction" (
    "id" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "userId" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseCommentReaction" (
    "id" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseCommentReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsCommentReaction" (
    "id" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsCommentReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsRating_userId_newsId_key" ON "NewsRating"("userId", "newsId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsReaction_userId_newsId_key" ON "NewsReaction"("userId", "newsId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseCommentReaction_userId_commentId_key" ON "CourseCommentReaction"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsCommentReaction_userId_commentId_key" ON "NewsCommentReaction"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "NewsRating" ADD CONSTRAINT "NewsRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsRating" ADD CONSTRAINT "NewsRating_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsReaction" ADD CONSTRAINT "NewsReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsReaction" ADD CONSTRAINT "NewsReaction_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseCommentReaction" ADD CONSTRAINT "CourseCommentReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseCommentReaction" ADD CONSTRAINT "CourseCommentReaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "CourseComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsCommentReaction" ADD CONSTRAINT "NewsCommentReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsCommentReaction" ADD CONSTRAINT "NewsCommentReaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "NewsComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
