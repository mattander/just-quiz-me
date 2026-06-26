ALTER TABLE quiz_publications RENAME TO quiz_publications_previous;

ALTER TABLE published_quizzes RENAME TO published_quizzes_previous;

ALTER TABLE quiz_revisions RENAME TO quiz_revisions_previous;

CREATE TABLE quiz_revisions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES quiz_documents(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL CHECK (revision_number >= 1),
  source_kind TEXT NOT NULL CHECK (source_kind IN ('seed_manifest', 'ai_generated', 'manual_import')),
  source_identifier TEXT NOT NULL,
  source_model TEXT,
  source_prompt TEXT,
  source_metadata_json TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  review_status TEXT NOT NULL CHECK (review_status IN ('generated', 'needs_review', 'approved', 'rejected')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  manifest_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (quiz_id, revision_number),
  UNIQUE (source_kind, source_identifier)
);

INSERT INTO quiz_revisions (
  id,
  quiz_id,
  revision_number,
  source_kind,
  source_identifier,
  source_model,
  source_prompt,
  source_metadata_json,
  status,
  review_status,
  title,
  description,
  manifest_json,
  created_at,
  updated_at
)
SELECT
  id,
  quiz_id,
  revision_number,
  source_kind,
  source_identifier,
  NULL,
  NULL,
  NULL,
  status,
  'approved',
  title,
  description,
  manifest_json,
  created_at,
  updated_at
FROM quiz_revisions_previous;

CREATE TABLE quiz_publications (
  quiz_id TEXT PRIMARY KEY REFERENCES quiz_documents(id) ON DELETE CASCADE,
  revision_id TEXT NOT NULL UNIQUE REFERENCES quiz_revisions(id) ON DELETE CASCADE,
  published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO quiz_publications (
  quiz_id,
  revision_id,
  published_at,
  updated_at
)
SELECT
  quiz_id,
  revision_id,
  published_at,
  updated_at
FROM quiz_publications_previous;

CREATE TABLE published_quizzes (
  quiz_id TEXT PRIMARY KEY REFERENCES quiz_documents(id) ON DELETE CASCADE,
  revision_id TEXT NOT NULL UNIQUE REFERENCES quiz_revisions(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  manifest_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO published_quizzes (
  quiz_id,
  revision_id,
  slug,
  title,
  description,
  manifest_json,
  updated_at
)
SELECT
  quiz_id,
  revision_id,
  slug,
  title,
  description,
  manifest_json,
  updated_at
FROM published_quizzes_previous;

DROP TABLE published_quizzes_previous;

DROP TABLE quiz_publications_previous;

DROP TABLE quiz_revisions_previous;

CREATE INDEX IF NOT EXISTS idx_quiz_revisions_quiz_revision_number
  ON quiz_revisions(quiz_id, revision_number DESC);

CREATE INDEX IF NOT EXISTS idx_quiz_revisions_source
  ON quiz_revisions(source_kind, source_identifier);

CREATE INDEX IF NOT EXISTS idx_quiz_revisions_review_status
  ON quiz_revisions(review_status, updated_at DESC);
