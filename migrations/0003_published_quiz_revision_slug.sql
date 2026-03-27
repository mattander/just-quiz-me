ALTER TABLE published_quiz_revisions
ADD COLUMN slug TEXT;

UPDATE published_quiz_revisions
SET slug = (
  SELECT quiz_revisions.slug
  FROM quiz_revisions
  WHERE quiz_revisions.id = published_quiz_revisions.quiz_revision_id
)
WHERE slug IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_published_quiz_revisions_slug
  ON published_quiz_revisions(slug);
