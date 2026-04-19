-- Club: JSON translations, migrate from nameEn/descriptionEn
ALTER TABLE "Club" ADD COLUMN "translations" JSONB NOT NULL DEFAULT '{}';

UPDATE "Club" SET "translations" = jsonb_strip_nulls(
  jsonb_build_object(
    'name', CASE WHEN NULLIF(TRIM(COALESCE("nameEn", '')), '') IS NOT NULL
      THEN jsonb_build_object('en', TRIM("nameEn")) END,
    'description', CASE WHEN NULLIF(TRIM(COALESCE("descriptionEn", '')), '') IS NOT NULL
      THEN jsonb_build_object('en', TRIM("descriptionEn")) END
  )
);

ALTER TABLE "Club" DROP COLUMN IF EXISTS "nameEn";
ALTER TABLE "Club" DROP COLUMN IF EXISTS "descriptionEn";

-- Magazine
ALTER TABLE "Magazine" ADD COLUMN "translations" JSONB NOT NULL DEFAULT '{}';

UPDATE "Magazine" SET "translations" = jsonb_strip_nulls(
  jsonb_build_object(
    'title', CASE WHEN NULLIF(TRIM(COALESCE("titleEn", '')), '') IS NOT NULL
      THEN jsonb_build_object('en', TRIM("titleEn")) END,
    'description', CASE WHEN NULLIF(TRIM(COALESCE("descriptionEn", '')), '') IS NOT NULL
      THEN jsonb_build_object('en', TRIM("descriptionEn")) END
  )
);

ALTER TABLE "Magazine" DROP COLUMN IF EXISTS "titleEn";
ALTER TABLE "Magazine" DROP COLUMN IF EXISTS "descriptionEn";

-- Activity
ALTER TABLE "Activity" ADD COLUMN "translations" JSONB NOT NULL DEFAULT '{}';

UPDATE "Activity" SET "translations" = jsonb_strip_nulls(
  jsonb_build_object(
    'title', CASE WHEN NULLIF(TRIM(COALESCE("titleEn", '')), '') IS NOT NULL
      THEN jsonb_build_object('en', TRIM("titleEn")) END,
    'content', CASE WHEN NULLIF(TRIM(COALESCE("contentEn", '')), '') IS NOT NULL
      THEN jsonb_build_object('en', TRIM("contentEn")) END
  )
);

ALTER TABLE "Activity" DROP COLUMN IF EXISTS "titleEn";
ALTER TABLE "Activity" DROP COLUMN IF EXISTS "contentEn";
