-- CreateIndex
CREATE INDEX "board_category_workdate_idx" ON "board"("category", "workdate" DESC);

-- CreateIndex
CREATE INDEX "visitor_date_ip_idx" ON "visitor"("date", "ip");
