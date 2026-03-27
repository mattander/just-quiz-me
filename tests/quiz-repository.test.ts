import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { readdir } from 'node:fs/promises'
import test from 'node:test'
import { getPlatformProxy } from 'wrangler'
import {
  createQuizRepository,
  type PublishedQuiz,
} from '../src/lib/quiz-repository.ts'
import { parseQuizManifest, type QuizManifest } from '../src/lib/quiz-manifest.ts'
import {
  editorialQuizRowId,
  quizRevisionOptionRowId,
  quizRevisionQuestionRowId,
  quizRevisionResultRowId,
  quizRevisionRowId,
} from '../src/lib/quiz-storage.ts'

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

    assert.deepEqual(quizzes, [
      {
        slug: 'which-chaotic-breakfast-are-you',
        title: 'Which Chaotic Breakfast Are You?',
        description:
          'A politely unhinged breakfast quiz about coping styles, social energy, and how much structure your morning can survive.',
    },
  ])
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

test('repository reads the explicitly published revision when newer drafts exist', async () => {
  await withQuizDatabase(async (database) => {
    await seedQuizRevisionFixture(database, {
      editorialQuizId: publishedQuizFixture.id,
      revisions: [
        publishedQuizFixture,
        parseQuizManifest({
          ...publishedQuizFixture,
          slug: 'which-chaotic-breakfast-are-you-v2-draft',
          title: 'Which Chaotic Breakfast Are You? Draft Revision',
          description:
            'A newer draft revision that should stay private until explicitly published.',
          status: 'draft',
        }),
      ],
      publishedRevisionNumber: 1,
    })

    const repository = createQuizRepository(database)
    const quiz = await repository.readPublished('which-chaotic-breakfast-are-you')
    const draftQuiz = await repository.readPublished(
      'which-chaotic-breakfast-are-you-v2-draft',
    )

    assert.deepEqual(quiz, toPublishedQuizFixture(publishedQuizFixture))
    assert.equal(draftQuiz, null)
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
  const migrationEntries = await readdir(migrationsDirectoryUrl, {
    withFileTypes: true,
  })
  const migrationFileNames = migrationEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => entry.name)
    .sort()
  const dropStatements = [
    'DROP TABLE IF EXISTS quiz_revision_option_weights',
    'DROP TABLE IF EXISTS quiz_revision_options',
    'DROP TABLE IF EXISTS quiz_revision_questions',
    'DROP TABLE IF EXISTS quiz_revision_results',
    'DROP TABLE IF EXISTS published_quiz_revisions',
    'DROP TABLE IF EXISTS quiz_revisions',
    'DROP TABLE IF EXISTS editorial_quizzes',
    'DROP TABLE IF EXISTS quiz_option_weights',
    'DROP TABLE IF EXISTS quiz_options',
    'DROP TABLE IF EXISTS quiz_questions',
    'DROP TABLE IF EXISTS quiz_results',
    'DROP TABLE IF EXISTS quizzes',
    'DROP TABLE IF EXISTS app_settings',
  ]

  for (const statement of dropStatements) {
    await database.prepare(statement).run()
  }

  for (const migrationFileName of migrationFileNames) {
    const migrationSql = await readFile(
      new URL(migrationFileName, migrationsDirectoryUrl),
      'utf8',
    )
    const migrationStatements = migrationSql
      .split(';')
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0)

    for (const statement of migrationStatements) {
      await database.prepare(statement).run()
    }
  }

}

async function seedQuizFixtures(
  database: D1Database,
  manifests: QuizManifest[],
): Promise<void> {
  const statements: D1PreparedStatement[] = []

  for (const manifest of manifests) {
    const editorialQuizId = editorialQuizRowId(manifest.id)
    const revisionId = quizRevisionRowId(manifest.id, 1)

    statements.push(
      database
        .prepare(
          `
            INSERT INTO editorial_quizzes (
              id,
              created_at,
              updated_at
            )
            VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `,
        )
        .bind(editorialQuizId),
    )

    statements.push(
      database
        .prepare(
          `
            INSERT INTO quiz_revisions (
              id,
              editorial_quiz_id,
              revision_number,
              slug,
              status,
              title,
              description,
              created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          `,
        )
        .bind(
          revisionId,
          editorialQuizId,
          1,
          manifest.slug,
          manifest.status,
          manifest.title,
          manifest.description,
        ),
    )

    if (manifest.status === 'published') {
      statements.push(
        database
          .prepare(
            `
              INSERT INTO published_quiz_revisions (
                editorial_quiz_id,
                quiz_revision_id,
                slug,
                published_at
              )
              VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            `,
          )
          .bind(editorialQuizId, revisionId, manifest.slug),
      )
    }

    for (const [resultIndex, result] of manifest.results.entries()) {
      statements.push(
        database
          .prepare(
            `
              INSERT INTO quiz_revision_results (
                id,
                quiz_revision_id,
                result_key,
                position,
                title,
                description
              )
              VALUES (?, ?, ?, ?, ?, ?)
            `,
          )
          .bind(
            quizRevisionResultRowId(manifest.id, 1, result.id),
            revisionId,
            result.id,
            resultIndex + 1,
            result.title,
            result.description,
          ),
      )
    }

    for (const [questionIndex, question] of manifest.questions.entries()) {
      const questionId = quizRevisionQuestionRowId(manifest.id, 1, question.id)

      statements.push(
        database
          .prepare(
            `
              INSERT INTO quiz_revision_questions (
                id,
                quiz_revision_id,
                question_key,
                position,
                prompt
              )
              VALUES (?, ?, ?, ?, ?)
            `,
          )
          .bind(
            questionId,
            revisionId,
            question.id,
            questionIndex + 1,
            question.prompt,
          ),
      )

      for (const [optionIndex, option] of question.options.entries()) {
        const optionId = quizRevisionOptionRowId(
          manifest.id,
          1,
          question.id,
          option.id,
        )

        statements.push(
          database
            .prepare(
              `
                INSERT INTO quiz_revision_options (
                  id,
                  question_id,
                  option_key,
                  position,
                  label
                )
                VALUES (?, ?, ?, ?, ?)
              `,
            )
            .bind(
              optionId,
              questionId,
              option.id,
              optionIndex + 1,
              option.label,
            ),
        )

        for (const weight of option.weights) {
          statements.push(
            database
              .prepare(
                `
                  INSERT INTO quiz_revision_option_weights (
                    option_id,
                    result_id,
                    weight
                  )
                  VALUES (?, ?, ?)
                `,
              )
              .bind(
                optionId,
                quizRevisionResultRowId(manifest.id, 1, weight.resultId),
                weight.value,
              ),
          )
        }
      }
    }
  }

  await database.batch(statements)
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

async function seedQuizRevisionFixture(
  database: D1Database,
  fixture: {
    editorialQuizId: string
    revisions: QuizManifest[]
    publishedRevisionNumber: number
  },
): Promise<void> {
  const statements: D1PreparedStatement[] = []
  const editorialQuizId = editorialQuizRowId(fixture.editorialQuizId)

  statements.push(
    database
      .prepare(
        `
          INSERT INTO editorial_quizzes (
            id,
            created_at,
            updated_at
          )
          VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `,
      )
      .bind(editorialQuizId),
  )

  for (const [index, manifest] of fixture.revisions.entries()) {
    const revisionNumber = index + 1
    const revisionId = quizRevisionRowId(fixture.editorialQuizId, revisionNumber)

    statements.push(
      database
        .prepare(
          `
            INSERT INTO quiz_revisions (
              id,
              editorial_quiz_id,
              revision_number,
              slug,
              status,
              title,
              description,
              created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          `,
        )
        .bind(
          revisionId,
          editorialQuizId,
          revisionNumber,
          manifest.slug,
          manifest.status,
          manifest.title,
          manifest.description,
        ),
    )

    for (const [resultIndex, result] of manifest.results.entries()) {
      statements.push(
        database
          .prepare(
            `
              INSERT INTO quiz_revision_results (
                id,
                quiz_revision_id,
                result_key,
                position,
                title,
                description
              )
              VALUES (?, ?, ?, ?, ?, ?)
            `,
          )
          .bind(
            quizRevisionResultRowId(
              fixture.editorialQuizId,
              revisionNumber,
              result.id,
            ),
            revisionId,
            result.id,
            resultIndex + 1,
            result.title,
            result.description,
          ),
      )
    }

    for (const [questionIndex, question] of manifest.questions.entries()) {
      const questionId = quizRevisionQuestionRowId(
        fixture.editorialQuizId,
        revisionNumber,
        question.id,
      )

      statements.push(
        database
          .prepare(
            `
              INSERT INTO quiz_revision_questions (
                id,
                quiz_revision_id,
                question_key,
                position,
                prompt
              )
              VALUES (?, ?, ?, ?, ?)
            `,
          )
          .bind(
            questionId,
            revisionId,
            question.id,
            questionIndex + 1,
            question.prompt,
          ),
      )

      for (const [optionIndex, option] of question.options.entries()) {
        const optionId = quizRevisionOptionRowId(
          fixture.editorialQuizId,
          revisionNumber,
          question.id,
          option.id,
        )

        statements.push(
          database
            .prepare(
              `
                INSERT INTO quiz_revision_options (
                  id,
                  question_id,
                  option_key,
                  position,
                  label
                )
                VALUES (?, ?, ?, ?, ?)
              `,
            )
            .bind(
              optionId,
              questionId,
              option.id,
              optionIndex + 1,
              option.label,
            ),
        )

        for (const weight of option.weights) {
          statements.push(
            database
              .prepare(
                `
                  INSERT INTO quiz_revision_option_weights (
                    option_id,
                    result_id,
                    weight
                  )
                  VALUES (?, ?, ?)
                `,
              )
              .bind(
                optionId,
                quizRevisionResultRowId(
                  fixture.editorialQuizId,
                  revisionNumber,
                  weight.resultId,
                ),
                weight.value,
              ),
          )
        }
      }
    }
  }

  statements.push(
    database
      .prepare(
        `
          INSERT INTO published_quiz_revisions (
            editorial_quiz_id,
            quiz_revision_id,
            slug,
            published_at
          )
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `,
      )
      .bind(
        editorialQuizId,
        quizRevisionRowId(
          fixture.editorialQuizId,
          fixture.publishedRevisionNumber,
        ),
        fixture.revisions[fixture.publishedRevisionNumber - 1].slug,
      ),
  )

  await database.batch(statements)
}
