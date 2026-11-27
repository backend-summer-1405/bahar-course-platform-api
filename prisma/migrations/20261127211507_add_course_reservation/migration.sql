-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'AWAITING_PAYMENT', 'REJECTED', 'PAID', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "CourseReservation" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "paymentDeadline" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseReservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseReservation_userId_status_idx" ON "CourseReservation"("userId", "status");

-- CreateIndex
CREATE INDEX "CourseReservation_courseId_status_idx" ON "CourseReservation"("courseId", "status");

-- AddForeignKey
ALTER TABLE "CourseReservation" ADD CONSTRAINT "CourseReservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseReservation" ADD CONSTRAINT "CourseReservation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseReservation" ADD CONSTRAINT "CourseReservation_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
