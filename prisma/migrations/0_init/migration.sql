-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "user" (
    "idx" SERIAL NOT NULL,
    "id" VARCHAR NOT NULL,
    "username" VARCHAR NOT NULL,
    "nickname" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "role" VARCHAR NOT NULL DEFAULT 'admin',

    CONSTRAINT "user_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "board" (
    "id" SERIAL NOT NULL,
    "writer" VARCHAR NOT NULL,
    "title" VARCHAR NOT NULL,
    "subTitle" VARCHAR NOT NULL,
    "content" VARCHAR NOT NULL,
    "subContent" VARCHAR NOT NULL DEFAULT '',
    "thumbnail" VARCHAR NOT NULL DEFAULT '',
    "category" VARCHAR NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "workdate" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor" (
    "id" SERIAL NOT NULL,
    "ip" VARCHAR,
    "date" VARCHAR NOT NULL,

    CONSTRAINT "visitor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "board_category_idx" ON "board"("category");

-- CreateIndex
CREATE INDEX "board_workdate_idx" ON "board"("workdate");

-- CreateIndex
CREATE INDEX "visitor_date_idx" ON "visitor"("date");
