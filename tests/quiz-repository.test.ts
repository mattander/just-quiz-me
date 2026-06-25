import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import test from 'node:test'
import { getPlatformProxy } from 'wrangler'
import { quizManifests } from '../src/content/quizzes/index.ts'
import {
  createQuizRepository,
  type PublishedQuiz,
} from '../src/lib/quiz-repository.ts'
import { parseQuizManifest, type QuizManifest } from '../src/lib/quiz-manifest.ts'

const migrationsDirectoryUrl = new URL('../migrations/', import.meta.url)

const publishedQuizFixture = parseQuizManifest({
  id: 'which-chaotic-breakfast-are-you',
  slug: 'which-chaotic-breakfast-are-you',
  status: 'published',
  title: 'Which Chaotic Breakfast Are You?',
  description:
    'A politely unhinged breakfast quiz about coping styles, social energy, and how much structure your morning can survive.',
  results: [
    {
      id: 'buttered-toast',
      title: 'Buttered Toast',
      description:
        'You look simple from across the room, but you are carrying more warmth, competence, and emotional ballast than anyone expects.',
    },
    {
      id: 'cereal-at-midnight',
      title: 'Cereal at Midnight',
      description:
        'You are improvisational, suspicious of rules, and somehow still thriving while everyone else is looking for a spreadsheet.',
    },
  ],
  questions: [
    {
      id: 'alarm-style',
      prompt: 'How does your ideal morning begin?',
      options: [
        {
          id: 'one-alarm-and-up',
          label: 'One alarm, one stretch, immediate competence.',
          weights: [{ resultId: 'buttered-toast', value: 3 }],
        },
        {
          id: 'wake-up-when-vibes-arrive',
          label: 'I wake up when the vibes arrive and negotiate from there.',
          weights: [{ resultId: 'cereal-at-midnight', value: 3 }],
        },
      ],
    },
  ],
})

const draftQuizFixture = parseQuizManifest({
  id: 'which-overcommitted-desk-are-you',
  slug: 'which-overcommitted-desk-are-you',
  status: 'draft',
  title: 'Which Overcommitted Desk Are You?',
  description:
    'A draft-only desk quiz that should never leak into public repository reads or result lookups.',
  results: [
    {
      id: 'stacked-trays',
      title: 'Stacked Trays',
      description:
        'You believe order is possible if you add one more labeled surface to the situation.',
    },
    {
      id: 'mysterious-pile',
      title: 'Mysterious Pile',
      description:
        'Your system is intuitive, emotionally resonant, and completely opaque to outside observers.',
    },
  ],
  questions: [
    {
      id: 'desk-vibe',
      prompt: 'What does your desk communicate before you say a word?',
      options: [
        {
          id: 'color-coded',
          label: 'I own a label maker and I am not afraid to use it.',
          weights: [{ resultId: 'stacked-trays', value: 2 }],
        },
        {
          id: 'creative-storm',
          label: 'A creative storm is in progress and all artifacts are mission critical.',
          weights: [{ resultId: 'mysterious-pile', value: 2 }],
        },
      ],
    },
  ],
})

test('seeded repository lists the authored published quizzes without a database', async () => {
  const repository = createQuizRepository(undefined)
  const quizzes = await repository.listPublished()

  assert.deepEqual(
    quizzes,
    quizManifests
      .filter((manifest) => manifest.status === 'published')
      .map((manifest) => ({
        slug: manifest.slug,
        title: manifest.title,
        description: manifest.description,
      })),
  )
})

test('repository reads only published D1 quizzes and hydrates their nested content', async () => {
  await withQuizDatabase(async (database) => {
    await seedQuizFixtures(database, [publishedQuizFixture, draftQuizFixture])

    const repository = createQuizRepository(database)
    const quizzes = await repository.listPublished()
    const quiz = await repository.readPublished('which-chaotic-breakfast-are-you')

    assert.deepEqual(quizzes, [
      {
        slug: 'which-chaotic-breakfast-are-you',
        title: 'Which Chaotic Breakfast Are You?',
        description:
          'A politely unhinged breakfast quiz about coping styles, social energy, and how much structure your morning can survive.',
      },
    ])

    assert.deepEqual(quiz, toPublishedQuizFixture(publishedQuizFixture))
    assert.equal(
      await repository.readPublished('which-overcommitted-desk-are-you'),
      null,
    )
  })
})

test('repository result lookup returns published results and hides draft results', async () => {
  await withQuizDatabase(async (database) => {
    await seedQuizFixtures(database, [publishedQuizFixture, draftQuizFixture])

    const repository = createQuizRepository(database)
    const publishedResult = await repository.readPublishedResult(
      'which-chaotic-breakfast-are-you',
      'buttered-toast',
    )
    const draftResult = await repository.readPublishedResult(
      'which-overcommitted-desk-are-you',
      'stacked-trays',
    )
    const missingResult = await repository.readPublishedResult(
      'which-chaotic-breakfast-are-you',
      'missing-result',
    )

    assert.deepEqual(publishedResult, {
      id: 'buttered-toast',
      title: 'Buttered Toast',
      description:
        'You look simple from across the room, but you are carrying more warmth, competence, and emotional ballast than anyone expects.',
    })
    assert.equal(draftResult, null)
    assert.equal(missingResult, null)
  })
})

async function withQuizDatabase(
  run: (database: D1Database) => Promise<void>,
): Promise<void> {
  const { env, dispose } = await getPlatformProxy<Pick<Cloudflare.LocalEnv, 'QUIZ_DB'>>(
    {
      environment: 'local',
    },
  )

  try {
    await resetQuizDatabase(env.QUIZ_DB)
    await run(env.QUIZ_DB)
  } finally {
    await resetQuizDatabase(env.QUIZ_DB)
    await dispose()
  }
}

async function resetQuizDatabase(database: D1Database): Promise<void> {
  const migrationStatements = await readMigrationStatements()
  const deleteStatements = [
    'DELETE FROM published_quizzes',
    'DELETE FROM quiz_publications',
    'DELETE FROM quiz_revisions',
    'DELETE FROM quiz_documents',
    'DELETE FROM quiz_option_weights',
    'DELETE FROM quiz_options',
    'DELETE FROM quiz_questions',
    'DELETE FROM quiz_results',
    'DELETE FROM quizzes',
    'DELETE FROM app_settings',
  ]

  for (const statement of migrationStatements) {
    await database.prepare(statement).run()
  }

  for (const statement of deleteStatements) {
    await database.prepare(statement).run()
  }
}

async function seedQuizFixtures(
  database: D1Database,
  manifests: QuizManifest[],
): Promise<void> {
  const statements: D1PreparedStatement[] = []

  for (const manifest of manifests) {
    const quizId = quizDocumentId(manifest.id)
    const revisionId = quizSeedRevisionId(manifest.id)
    const manifestJson = JSON.stringify(manifest)

    statements.push(
      database
        .prepare(
          `
            INSERT INTO quiz_documents (
              id,
              slug,
              created_at,
              updated_at
            )
            VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `,
        )
        .bind(quizId, manifest.slug),
    )

    statements.push(
      database
        .prepare(
          `
            INSERT INTO quiz_revisions (
              id,
              quiz_id,
              revision_number,
              source_kind,
              source_identifier,
              status,
              title,
              description,
              manifest_json,
              created_at,
              updated_at
            )
            VALUES (?, ?, 1, 'seed_manifest', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `,
        )
        .bind(
          revisionId,
          quizId,
          quizSeedSourceIdentifier(manifest.id),
          manifest.status,
          manifest.title,
          manifest.description,
          manifestJson,
        ),
    )

    if (manifest.status === 'published') {
      statements.push(
        database
          .prepare(
            `
              INSERT INTO quiz_publications (
                quiz_id,
                revision_id,
                published_at,
                updated_at
              )
              VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `,
          )
          .bind(quizId, revisionId),
      )

      statements.push(
        database
          .prepare(
            `
              INSERT INTO published_quizzes (
                quiz_id,
                revision_id,
                slug,
                title,
                description,
                manifest_json,
                updated_at
              )
              VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `,
          )
          .bind(
            quizId,
            revisionId,
            manifest.slug,
            manifest.title,
            manifest.description,
            manifestJson,
          ),
      )
    }
  }

  await database.batch(statements)
}

async function readMigrationStatements(): Promise<string[]> {
  const migrationEntries = await readdir(migrationsDirectoryUrl, {
    withFileTypes: true,
  })
  const migrationFiles = migrationEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => entry.name)
    .sort()
  const migrationStatements: string[] = []

  for (const migrationFile of migrationFiles) {
    const migrationSql = await readFile(
      new URL(migrationFile, migrationsDirectoryUrl),
      'utf8',
    )

    for (const statement of migrationSql
      .split(';')
      .map((value) => value.trim())
      .filter((value) => value.length > 0)) {
      migrationStatements.push(statement)
    }
  }

  return migrationStatements
}

function quizDocumentId(quizId: string): string {
  return `quiz:${quizId}`
}

function quizSeedRevisionId(quizId: string): string {
  return `${quizDocumentId(quizId)}:revision:seed`
}

function quizSeedSourceIdentifier(quizId: string): string {
  return `seed-manifest:${quizId}`
}

function toPublishedQuizFixture(manifest: QuizManifest): PublishedQuiz {
  return {
    slug: manifest.slug,
    title: manifest.title,
    description: manifest.description,
    results: manifest.results,
    questions: manifest.questions,
  }
}
