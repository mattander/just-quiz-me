import { getPlatformProxy } from 'wrangler'
import { appSettings } from '../src/content/settings/index.ts'
import { quizManifests } from '../src/content/quizzes/index.ts'
import {
  editorialQuizRowId,
  quizRevisionOptionRowId,
  quizRevisionQuestionRowId,
  quizRevisionResultRowId,
  quizRevisionRowId,
  seededQuizRevisionNumber,
} from '../src/lib/quiz-storage.ts'

function toSqliteBoolean(value: boolean): number {
  return value ? 1 : 0
}

async function main() {
  const { env, dispose } = await getPlatformProxy<Pick<CloudflareEnv, 'QUIZ_DB'>>({
    environment: 'local',
  })

  try {
    const featuredQuizExists = quizManifests.some(
      (manifest) => manifest.slug === appSettings.featuredQuizSlug,
    )

    if (!featuredQuizExists) {
      throw new Error(
        `Featured quiz slug "${appSettings.featuredQuizSlug}" does not match a registered quiz manifest.`,
      )
    }

    const statements: D1PreparedStatement[] = []
    const editorialQuizIds = quizManifests.map((manifest) =>
      editorialQuizRowId(manifest.id),
    )

    if (editorialQuizIds.length > 0) {
      const editorialQuizPlaceholders = editorialQuizIds.map(() => '?').join(', ')

      statements.push(
        env.QUIZ_DB.prepare(
          `
            DELETE FROM editorial_quizzes
            WHERE id NOT IN (${editorialQuizPlaceholders})
          `,
        ).bind(...editorialQuizIds),
      )
    } else {
      statements.push(env.QUIZ_DB.prepare('DELETE FROM editorial_quizzes'))
    }

    statements.push(env.QUIZ_DB.prepare('DELETE FROM quiz_option_weights'))
    statements.push(env.QUIZ_DB.prepare('DELETE FROM quiz_options'))
    statements.push(env.QUIZ_DB.prepare('DELETE FROM quiz_questions'))
    statements.push(env.QUIZ_DB.prepare('DELETE FROM quiz_results'))
    statements.push(env.QUIZ_DB.prepare('DELETE FROM quizzes'))

    statements.push(
      env.QUIZ_DB.prepare(
        `
          INSERT INTO app_settings (
            id,
            ads_enabled,
            featured_quiz_slug,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          ON CONFLICT(id) DO UPDATE SET
            ads_enabled = excluded.ads_enabled,
            featured_quiz_slug = excluded.featured_quiz_slug,
            updated_at = CURRENT_TIMESTAMP
        `,
      ).bind(
        appSettings.id,
        toSqliteBoolean(appSettings.adsEnabled),
        appSettings.featuredQuizSlug,
      ),
    )

    for (const manifest of quizManifests) {
      const editorialQuizId = editorialQuizRowId(manifest.id)
      const quizRevisionId = quizRevisionRowId(
        manifest.id,
        seededQuizRevisionNumber,
      )

      statements.push(
        env.QUIZ_DB.prepare(
          'DELETE FROM editorial_quizzes WHERE id = ?',
        ).bind(editorialQuizId),
      )

      statements.push(
        env.QUIZ_DB.prepare(
          `
            INSERT INTO editorial_quizzes (
              id,
              created_at,
              updated_at
            )
            VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `,
        ).bind(editorialQuizId),
      )

      statements.push(
        env.QUIZ_DB.prepare(
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
        ).bind(
          quizRevisionId,
          editorialQuizId,
          seededQuizRevisionNumber,
          manifest.slug,
          manifest.status,
          manifest.title,
          manifest.description,
        ),
      )

      if (manifest.status === 'published') {
        statements.push(
          env.QUIZ_DB.prepare(
            `
              INSERT INTO published_quiz_revisions (
                editorial_quiz_id,
                quiz_revision_id,
                slug,
                published_at
              )
              VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            `,
          ).bind(editorialQuizId, quizRevisionId, manifest.slug),
        )
      }

      for (const [resultIndex, result] of manifest.results.entries()) {
        statements.push(
          env.QUIZ_DB.prepare(
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
          ).bind(
            quizRevisionResultRowId(
              manifest.id,
              seededQuizRevisionNumber,
              result.id,
            ),
            quizRevisionId,
            result.id,
            resultIndex + 1,
            result.title,
            result.description,
          ),
        )
      }

      for (const [questionIndex, question] of manifest.questions.entries()) {
        const currentQuestionRowId = quizRevisionQuestionRowId(
          manifest.id,
          seededQuizRevisionNumber,
          question.id,
        )

        statements.push(
          env.QUIZ_DB.prepare(
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
          ).bind(
            currentQuestionRowId,
            quizRevisionId,
            question.id,
            questionIndex + 1,
            question.prompt,
          ),
        )

        for (const [optionIndex, option] of question.options.entries()) {
          const currentOptionRowId = quizRevisionOptionRowId(
            manifest.id,
            seededQuizRevisionNumber,
            question.id,
            option.id,
          )

          statements.push(
            env.QUIZ_DB.prepare(
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
            ).bind(
              currentOptionRowId,
              currentQuestionRowId,
              option.id,
              optionIndex + 1,
              option.label,
            ),
          )

          for (const weight of option.weights) {
            statements.push(
              env.QUIZ_DB.prepare(
                `
                  INSERT INTO quiz_revision_option_weights (
                    option_id,
                    result_id,
                    weight
                  )
                  VALUES (?, ?, ?)
                `,
              ).bind(
                currentOptionRowId,
                quizRevisionResultRowId(
                  manifest.id,
                  seededQuizRevisionNumber,
                  weight.resultId,
                ),
                weight.value,
              ),
            )
          }
        }
      }
    }

    await env.QUIZ_DB.batch(statements)

    console.log(
      `Synced app settings and ${quizManifests.length} quiz ${
        quizManifests.length === 1 ? 'manifest' : 'manifests'
      } into local D1.`,
    )
  } finally {
    await dispose()
  }
}

await main()
