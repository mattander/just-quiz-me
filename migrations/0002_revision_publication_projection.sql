CREATE TABLE IF NOT EXISTS quiz_documents (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_revisions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES quiz_documents(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL CHECK (revision_number >= 1),
  source_kind TEXT NOT NULL CHECK (source_kind IN ('seed_manifest')),
  source_identifier TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  manifest_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (quiz_id, revision_number),
  UNIQUE (source_kind, source_identifier)
);

CREATE TABLE IF NOT EXISTS quiz_publications (
  quiz_id TEXT PRIMARY KEY REFERENCES quiz_documents(id) ON DELETE CASCADE,
  revision_id TEXT NOT NULL UNIQUE REFERENCES quiz_revisions(id) ON DELETE CASCADE,
  published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS published_quizzes (
  quiz_id TEXT PRIMARY KEY REFERENCES quiz_documents(id) ON DELETE CASCADE,
  revision_id TEXT NOT NULL UNIQUE REFERENCES quiz_revisions(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  manifest_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quiz_documents_slug
  ON quiz_documents(slug);

CREATE INDEX IF NOT EXISTS idx_quiz_revisions_quiz_revision_number
  ON quiz_revisions(quiz_id, revision_number DESC);

CREATE INDEX IF NOT EXISTS idx_quiz_revisions_source
  ON quiz_revisions(source_kind, source_identifier);

CREATE INDEX IF NOT EXISTS idx_published_quizzes_slug
  ON published_quizzes(slug);
