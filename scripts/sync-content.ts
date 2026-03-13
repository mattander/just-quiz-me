import { getPlatformProxy } from 'wrangler'
import { appSettings } from '../src/content/settings/index.ts'
import { quizManifests } from '../src/content/quizzes/index.ts'

function toSqliteBoolean(value: boolean): number {
  return value ? 1 : 0
}

function quizRowId(quizId: string): string {
  return `quiz:${quizId}`
}

function resultRowId(quizId: string, resultId: string): string {
  return `${quizRowId(quizId)}:result:${resultId}`
}

function questionRowId(quizId: string, questionId: string): string {
  return `${quizRowId(quizId)}:question:${questionId}`
}

function optionRowId(
  quizId: string,
  questionId: string,
  optionId: string,
): string {
  return `${questionRowId(quizId, questionId)}:option:${optionId}`
}

async function main() {
  const { env, dispose } = await getPlatformProxy<Pick<CloudflareEnv, 'QUIZ_DB'>>({
    environment: 'local',
  })

  try {
    const statements: D1PreparedStatement[] = []

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
      const currentQuizRowId = quizRowId(manifest.id)

      statements.push(
        env.QUIZ_DB.prepare('DELETE FROM quizzes WHERE id = ?').bind(currentQuizRowId),
      )

      statements.push(
        env.QUIZ_DB.prepare(
          `
            INSERT INTO quizzes (
              id,
              slug,
              status,
              title,
              description,
              created_at,
              updated_at
            )
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `,
        ).bind(
          currentQuizRowId,
          manifest.slug,
          manifest.status,
          manifest.title,
          manifest.description,
        ),
      )

      for (const [resultIndex, result] of manifest.results.entries()) {
        statements.push(
          env.QUIZ_DB.prepare(
            `
              INSERT INTO quiz_results (
                id,
                quiz_id,
                result_key,
                position,
                title,
                description
              )
              VALUES (?, ?, ?, ?, ?, ?)
            `,
          ).bind(
            resultRowId(manifest.id, result.id),
            currentQuizRowId,
            result.id,
            resultIndex + 1,
            result.title,
            result.description,
          ),
        )
      }

      for (const [questionIndex, question] of manifest.questions.entries()) {
        const currentQuestionRowId = questionRowId(manifest.id, question.id)

        statements.push(
          env.QUIZ_DB.prepare(
            `
              INSERT INTO quiz_questions (
                id,
                quiz_id,
                question_key,
                position,
                prompt
              )
              VALUES (?, ?, ?, ?, ?)
            `,
          ).bind(
            currentQuestionRowId,
            currentQuizRowId,
            question.id,
            questionIndex + 1,
            question.prompt,
          ),
        )

        for (const [optionIndex, option] of question.options.entries()) {
          const currentOptionRowId = optionRowId(manifest.id, question.id, option.id)

          statements.push(
            env.QUIZ_DB.prepare(
              `
                INSERT INTO quiz_options (
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
                  INSERT INTO quiz_option_weights (
                    option_id,
                    result_id,
                    weight
                  )
                  VALUES (?, ?, ?)
                `,
              ).bind(
                currentOptionRowId,
                resultRowId(manifest.id, weight.resultId),
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
