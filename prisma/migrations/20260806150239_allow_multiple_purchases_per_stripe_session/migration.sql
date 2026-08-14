-- DropIndex
DROP INDEX "Purchase_stripeSessionId_key";

-- CreateIndex
CREATE INDEX "Purchase_stripeSessionId_idx" ON "Purchase"("stripeSessionId");
