CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY,
  ads_enabled INTEGER NOT NULL DEFAULT 0 CHECK (ads_enabled IN (0, 1)),
  featured_quiz_slug TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  result_key TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 1),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  UNIQUE (quiz_id, result_key)
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 1),
  prompt TEXT NOT NULL,
  UNIQUE (quiz_id, question_key)
);

CREATE TABLE IF NOT EXISTS quiz_options (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_key TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 1),
  label TEXT NOT NULL,
  UNIQUE (question_id, option_key)
);

CREATE TABLE IF NOT EXISTS quiz_option_weights (
  option_id TEXT NOT NULL REFERENCES quiz_options(id) ON DELETE CASCADE,
  result_id TEXT NOT NULL REFERENCES quiz_results(id) ON DELETE CASCADE,
  weight INTEGER NOT NULL CHECK (weight BETWEEN 1 AND 5),
  PRIMARY KEY (option_id, result_id)
);

CREATE INDEX IF NOT EXISTS idx_quizzes_status_slug
  ON quizzes(status, slug);

CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz_position
  ON quiz_results(quiz_id, position);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_position
  ON quiz_questions(quiz_id, position);

CREATE INDEX IF NOT EXISTS idx_quiz_options_question_position
  ON quiz_options(question_id, position);

CREATE INDEX IF NOT EXISTS idx_quiz_option_weights_result_id
  ON quiz_option_weights(result_id);
