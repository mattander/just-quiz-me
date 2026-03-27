CREATE TABLE IF NOT EXISTS editorial_quizzes (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_revisions (
  id TEXT PRIMARY KEY,
  editorial_quiz_id TEXT NOT NULL REFERENCES editorial_quizzes(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL CHECK (revision_number >= 1),
  slug TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (editorial_quiz_id, revision_number)
);

CREATE TABLE IF NOT EXISTS published_quiz_revisions (
  editorial_quiz_id TEXT PRIMARY KEY REFERENCES editorial_quizzes(id) ON DELETE CASCADE,
  quiz_revision_id TEXT NOT NULL UNIQUE REFERENCES quiz_revisions(id) ON DELETE CASCADE,
  published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_revision_results (
  id TEXT PRIMARY KEY,
  quiz_revision_id TEXT NOT NULL REFERENCES quiz_revisions(id) ON DELETE CASCADE,
  result_key TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 1),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  UNIQUE (quiz_revision_id, result_key)
);

CREATE TABLE IF NOT EXISTS quiz_revision_questions (
  id TEXT PRIMARY KEY,
  quiz_revision_id TEXT NOT NULL REFERENCES quiz_revisions(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 1),
  prompt TEXT NOT NULL,
  UNIQUE (quiz_revision_id, question_key)
);

CREATE TABLE IF NOT EXISTS quiz_revision_options (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES quiz_revision_questions(id) ON DELETE CASCADE,
  option_key TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 1),
  label TEXT NOT NULL,
  UNIQUE (question_id, option_key)
);

CREATE TABLE IF NOT EXISTS quiz_revision_option_weights (
  option_id TEXT NOT NULL REFERENCES quiz_revision_options(id) ON DELETE CASCADE,
  result_id TEXT NOT NULL REFERENCES quiz_revision_results(id) ON DELETE CASCADE,
  weight INTEGER NOT NULL CHECK (weight BETWEEN 1 AND 5),
  PRIMARY KEY (option_id, result_id)
);

CREATE INDEX IF NOT EXISTS idx_quiz_revisions_slug
  ON quiz_revisions(slug);

CREATE INDEX IF NOT EXISTS idx_quiz_revision_results_revision_position
  ON quiz_revision_results(quiz_revision_id, position);

CREATE INDEX IF NOT EXISTS idx_quiz_revision_questions_revision_position
  ON quiz_revision_questions(quiz_revision_id, position);

CREATE INDEX IF NOT EXISTS idx_quiz_revision_options_question_position
  ON quiz_revision_options(question_id, position);

CREATE INDEX IF NOT EXISTS idx_quiz_revision_option_weights_result_id
  ON quiz_revision_option_weights(result_id);

INSERT OR IGNORE INTO editorial_quizzes (
  id,
  created_at,
  updated_at
)
SELECT
  id,
  created_at,
  updated_at
FROM quizzes;

INSERT OR IGNORE INTO quiz_revisions (
  id,
  editorial_quiz_id,
  revision_number,
  slug,
  status,
  title,
  description,
  created_at
)
SELECT
  quizzes.id || ':revision:0001',
  quizzes.id,
  1,
  quizzes.slug,
  quizzes.status,
  quizzes.title,
  quizzes.description,
  quizzes.created_at
FROM quizzes;

INSERT OR IGNORE INTO published_quiz_revisions (
  editorial_quiz_id,
  quiz_revision_id,
  published_at
)
SELECT
  quizzes.id,
  quizzes.id || ':revision:0001',
  quizzes.updated_at
FROM quizzes
WHERE quizzes.status = 'published';

INSERT OR IGNORE INTO quiz_revision_results (
  id,
  quiz_revision_id,
  result_key,
  position,
  title,
  description
)
SELECT
  quiz_results.id || ':revision:0001',
  quiz_results.quiz_id || ':revision:0001',
  quiz_results.result_key,
  quiz_results.position,
  quiz_results.title,
  quiz_results.description
FROM quiz_results;

INSERT OR IGNORE INTO quiz_revision_questions (
  id,
  quiz_revision_id,
  question_key,
  position,
  prompt
)
SELECT
  quiz_questions.id || ':revision:0001',
  quiz_questions.quiz_id || ':revision:0001',
  quiz_questions.question_key,
  quiz_questions.position,
  quiz_questions.prompt
FROM quiz_questions;

INSERT OR IGNORE INTO quiz_revision_options (
  id,
  question_id,
  option_key,
  position,
  label
)
SELECT
  quiz_options.id || ':revision:0001',
  quiz_options.question_id || ':revision:0001',
  quiz_options.option_key,
  quiz_options.position,
  quiz_options.label
FROM quiz_options;

INSERT OR IGNORE INTO quiz_revision_option_weights (
  option_id,
  result_id,
  weight
)
SELECT
  quiz_option_weights.option_id || ':revision:0001',
  quiz_option_weights.result_id || ':revision:0001',
  quiz_option_weights.weight
FROM quiz_option_weights;
