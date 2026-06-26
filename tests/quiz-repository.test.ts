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

const generatedDraftFixture = parseQuizManifest({
  id: 'which-office-plant-knows-too-much',
  slug: 'which-office-plant-knows-too-much',
  status: 'draft',
  title: 'Which Office Plant Knows Too Much?',
  description:
    'A suspiciously leafy quiz about workplace secrets, ambient listening, and photosynthesis with an agenda.',
  results: [
    {
      id: 'peace-lily-in-legal',
      title: 'Peace Lily in Legal',
      description:
        'You absorb conflict through the air and somehow always know which meeting should have been an email.',
    },
    {
      id: 'snake-plant-by-printer',
      title: 'Snake Plant by the Printer',
      description:
        'You are low maintenance, impossible to impress, and present for every confidential toner incident.',
    },
  ],
  questions: [
    {
      id: 'confidential-vibe',
      prompt: 'A coworker whispers near your leaves. What do you do?',
      options: [
        {
          id: 'document-everything',
          label: 'Remain still, collect context, and develop a private timeline.',
          weights: [{ resultId: 'peace-lily-in-legal', value: 3 }],
        },
        {
          id: 'jam-printer',
          label: 'Cause a printer jam at exactly the funniest possible moment.',
          weights: [{ resultId: 'snake-plant-by-printer', value: 3 }],
        },
      ],
    },
  ],
})

const generatedRevisionForPublishedQuizFixture = parseQuizManifest({
  id: 'which-chaotic-breakfast-are-you',
  slug: 'which-chaotic-breakfast-are-you',
  status: 'draft',
  title: 'Which Chaotic Breakfast Are You? Draft Revision',
  description:
    'A draft revision for an already published breakfast quiz that should not replace public content until review.',
  results: [
    {
      id: 'very-focused-oatmeal',
      title: 'Very Focused Oatmeal',
      description:
        'You are calm, structured, and somehow making everyone else feel like they forgot a meeting.',
    },
    {
      id: 'espresso-in-a-bowl',
      title: 'Espresso in a Bowl',
      description:
        'You are technically breakfast, spiritually a small emergency, and probably correct about the timeline.',
    },
  ],
  questions: [
    {
      id: 'morning-risk',
      prompt: 'Your morning plan collapses immediately. What happens next?',
      options: [
        {
          id: 'stabilize-the-room',
          label: 'Stabilize the room with quiet competence and a clean spoon.',
          weights: [{ resultId: 'very-focused-oatmeal', value: 3 }],
        },
        {
          id: 'accelerate-the-plot',
          label: 'Accelerate the plot and become legally breakfast-adjacent.',
          weights: [{ resultId: 'espresso-in-a-bowl', value: 3 }],
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

test('repository ingests AI generated drafts with review metadata without publishing them', async () => {
  await withQuizDatabase(async (database) => {
    await seedQuizFixtures(database, [publishedQuizFixture])

    const repository = createQuizRepository(database)
    const summary = await repository.ingestGeneratedDraft({
      manifest: generatedDraftFixture,
      source: {
        identifier: 'github-actions:run-123:office-plant',
        model: 'gpt-5.4-mini',
        prompt: 'Generate a coherent quiz about an office plant that knows too much.',
        metadataJson: JSON.stringify({
          workflow: 'quiz-draft-generation',
          runId: '123',
        }),
      },
    })
    const draftReviews = await repository.listDraftReviews()

    assert.deepEqual(summary, {
      id: 'quiz:which-office-plant-knows-too-much:revision:1',
      quizId: 'quiz:which-office-plant-knows-too-much',
      revisionNumber: 1,
      sourceKind: 'ai_generated',
      sourceIdentifier: 'github-actions:run-123:office-plant',
      sourceModel: 'gpt-5.4-mini',
      reviewStatus: 'generated',
      title: 'Which Office Plant Knows Too Much?',
      description:
        'A suspiciously leafy quiz about workplace secrets, ambient listening, and photosynthesis with an agenda.',
    })
    assert.deepEqual(draftReviews, [summary])
    assert.equal(
      await repository.readPublished('which-office-plant-knows-too-much'),
      null,
    )

    const provenanceRow = await database
      .prepare(
        `
          SELECT source_kind, source_identifier, source_model, source_prompt, source_metadata_json, review_status
          FROM quiz_revisions
          WHERE id = ?
          LIMIT 1
        `,
      )
      .bind(summary.id)
      .first<{
        source_kind: string
        source_identifier: string
        source_model: string
        source_prompt: string
        source_metadata_json: string
        review_status: string
      }>()

    assert.deepEqual(provenanceRow, {
      source_kind: 'ai_generated',
      source_identifier: 'github-actions:run-123:office-plant',
      source_model: 'gpt-5.4-mini',
      source_prompt: 'Generate a coherent quiz about an office plant that knows too much.',
      source_metadata_json: '{"workflow":"quiz-draft-generation","runId":"123"}',
      review_status: 'generated',
    })
  })
})

test('repository preserves the current publication when ingesting a generated draft revision', async () => {
  await withQuizDatabase(async (database) => {
    await seedQuizFixtures(database, [publishedQuizFixture])

    const repository = createQuizRepository(database)
    const summary = await repository.ingestGeneratedDraft({
      manifest: generatedRevisionForPublishedQuizFixture,
      source: {
        identifier: 'github-actions:run-456:breakfast-revision',
        model: 'gpt-5.4-mini',
      },
    })

    assert.equal(summary.revisionNumber, 2)
    assert.deepEqual(
      await repository.readPublished('which-chaotic-breakfast-are-you'),
      toPublishedQuizFixture(publishedQuizFixture),
    )
    assert.deepEqual(await repository.listPublished(), [
      {
        slug: 'which-chaotic-breakfast-are-you',
        title: 'Which Chaotic Breakfast Are You?',
        description:
          'A politely unhinged breakfast quiz about coping styles, social energy, and how much structure your morning can survive.',
      },
    ])
  })
})

test('repository rejects generated drafts that try to start published', async () => {
  await withQuizDatabase(async (database) => {
    const repository = createQuizRepository(database)

    await assert.rejects(
      repository.ingestGeneratedDraft({
        manifest: publishedQuizFixture,
        source: {
          identifier: 'github-actions:run-123:published',
          model: 'gpt-5.4-mini',
        },
      }),
      /Generated quiz drafts must use draft status/,
    )

    assert.deepEqual(await repository.listDraftReviews(), [])
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
              review_status,
              title,
              description,
              manifest_json,
              created_at,
              updated_at
            )
            VALUES (?, ?, 1, 'seed_manifest', ?, ?, 'approved', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
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
