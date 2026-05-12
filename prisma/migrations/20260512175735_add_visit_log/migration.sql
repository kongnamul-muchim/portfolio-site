-- CreateTable
CREATE TABLE "VisitLog" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VisitLog_date_idx" ON "VisitLog"("date");

-- CreateIndex
CREATE UNIQUE INDEX "VisitLog_ip_date_key" ON "VisitLog"("ip", "date");
