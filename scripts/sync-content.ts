import { getPlatformProxy } from 'wrangler'
import { appSettings } from '../src/content/settings/index.ts'
import { quizManifests } from '../src/content/quizzes/index.ts'

function toSqliteBoolean(value: boolean): number {
  return value ? 1 : 0
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

function serializeManifest(manifest: (typeof quizManifests)[number]): string {
  return JSON.stringify(manifest)
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
    const manifestQuizIds = quizManifests.map((manifest) => quizDocumentId(manifest.id))

    if (manifestQuizIds.length > 0) {
      const quizIdPlaceholders = manifestQuizIds.map(() => '?').join(', ')

      statements.push(
        env.QUIZ_DB.prepare(
          `DELETE FROM published_quizzes WHERE quiz_id NOT IN (${quizIdPlaceholders})`,
        ).bind(...manifestQuizIds),
      )
      statements.push(
        env.QUIZ_DB.prepare(
          `DELETE FROM quiz_publications WHERE quiz_id NOT IN (${quizIdPlaceholders})`,
        ).bind(...manifestQuizIds),
      )
      statements.push(
        env.QUIZ_DB.prepare(
          `
            DELETE FROM quiz_revisions
            WHERE source_kind = 'seed_manifest'
              AND quiz_id NOT IN (${quizIdPlaceholders})
          `,
        ).bind(...manifestQuizIds),
      )
      statements.push(
        env.QUIZ_DB.prepare(
          `
            DELETE FROM quiz_documents
            WHERE id NOT IN (${quizIdPlaceholders})
              AND NOT EXISTS (
                SELECT 1
                FROM quiz_revisions
                WHERE quiz_revisions.quiz_id = quiz_documents.id
              )
          `,
        ).bind(...manifestQuizIds),
      )
    } else {
      statements.push(env.QUIZ_DB.prepare('DELETE FROM published_quizzes'))
      statements.push(env.QUIZ_DB.prepare('DELETE FROM quiz_publications'))
      statements.push(
        env.QUIZ_DB.prepare(
          "DELETE FROM quiz_revisions WHERE source_kind = 'seed_manifest'",
        ),
      )
      statements.push(
        env.QUIZ_DB.prepare(
          `
            DELETE FROM quiz_documents
            WHERE NOT EXISTS (
              SELECT 1
              FROM quiz_revisions
              WHERE quiz_revisions.quiz_id = quiz_documents.id
            )
          `,
        ),
      )
    }

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
      const currentQuizDocumentId = quizDocumentId(manifest.id)
      const currentRevisionId = quizSeedRevisionId(manifest.id)
      const serializedManifest = serializeManifest(manifest)

      statements.push(
        env.QUIZ_DB.prepare(
          `
            INSERT INTO quiz_documents (
              id,
              slug,
              created_at,
              updated_at
            )
            VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET
              slug = excluded.slug,
              updated_at = CURRENT_TIMESTAMP
          `,
        ).bind(
          currentQuizDocumentId,
          manifest.slug,
        ),
      )

      statements.push(
        env.QUIZ_DB.prepare(
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
            ON CONFLICT(id) DO UPDATE SET
              status = excluded.status,
              review_status = excluded.review_status,
              title = excluded.title,
              description = excluded.description,
              manifest_json = excluded.manifest_json,
              updated_at = CURRENT_TIMESTAMP
          `,
        ).bind(
          currentRevisionId,
          currentQuizDocumentId,
          quizSeedSourceIdentifier(manifest.id),
          manifest.status,
          manifest.title,
          manifest.description,
          serializedManifest,
        ),
      )

      if (manifest.status === 'published') {
        statements.push(
          env.QUIZ_DB.prepare(
            `
              INSERT INTO quiz_publications (
                quiz_id,
                revision_id,
                published_at,
                updated_at
              )
              VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
              ON CONFLICT(quiz_id) DO UPDATE SET
                revision_id = excluded.revision_id,
                updated_at = CURRENT_TIMESTAMP
            `,
          ).bind(currentQuizDocumentId, currentRevisionId),
        )

        statements.push(
          env.QUIZ_DB.prepare(
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
              ON CONFLICT(quiz_id) DO UPDATE SET
                revision_id = excluded.revision_id,
                slug = excluded.slug,
                title = excluded.title,
                description = excluded.description,
                manifest_json = excluded.manifest_json,
                updated_at = CURRENT_TIMESTAMP
            `,
          ).bind(
            currentQuizDocumentId,
            currentRevisionId,
            manifest.slug,
            manifest.title,
            manifest.description,
            serializedManifest,
          ),
        )
      } else {
        statements.push(
          env.QUIZ_DB.prepare('DELETE FROM published_quizzes WHERE quiz_id = ?').bind(
            currentQuizDocumentId,
          ),
        )
        statements.push(
          env.QUIZ_DB.prepare('DELETE FROM quiz_publications WHERE quiz_id = ?').bind(
            currentQuizDocumentId,
          ),
        )
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
