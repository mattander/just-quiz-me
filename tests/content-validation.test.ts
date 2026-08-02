import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import test from 'node:test'
import {
  getQuizCoverImage,
  getQuizQuestionImage,
  getQuizResultImage,
  type QuizImage,
} from '../src/content/quiz-images.ts'
import { quizManifests } from '../src/content/quizzes/index.ts'
import { seededAppSettings } from '../src/content/settings/index.ts'
import { validateAuthoredContent } from '../src/lib/content-validation.ts'
import {
  parseQuizManifest,
  parseQuizManifestCollection,
} from '../src/lib/quiz-manifest.ts'

const validManifest = parseQuizManifest({
  id: 'content-fixture',
  slug: 'content-fixture',
  status: 'published',
  title: 'Content Fixture',
  description: 'A valid content fixture for registry validation tests.',
  results: [
    {
      id: 'quiet-path',
      title: 'Quiet Path',
      description: 'A quieter result path that remains reachable.',
    },
    {
      id: 'loud-path',
      title: 'Loud Path',
      description: 'A louder result path that remains reachable.',
    },
  ],
  questions: [
    {
      id: 'tone',
      prompt: 'Which tone fits the fixture best today?',
      options: [
        {
          id: 'quiet-option',
          label: 'Keep things measured and calm.',
          weights: [{ resultId: 'quiet-path', value: 2 }],
        },
        {
          id: 'loud-option',
          label: 'Turn the volume up and commit.',
          weights: [{ resultId: 'loud-path', value: 2 }],
        },
      ],
    },
  ],
})

test('content validation reports manifest counts and accepts the featured slug', () => {
  const summary = validateAuthoredContent([validManifest], {
    ...seededAppSettings,
    featuredQuizSlug: 'content-fixture',
  })

  assert.deepEqual(summary, {
    manifestCount: 1,
    manifestCountLabel: 'manifest',
  })
})

test('content validation rejects missing featured quiz slugs', () => {
  assert.throws(
    () =>
      validateAuthoredContent([validManifest], {
        ...seededAppSettings,
        featuredQuizSlug: 'missing-quiz',
      }),
    /Featured quiz slug "missing-quiz" does not match a registered quiz manifest\./,
  )
})

test('quiz manifest parsing rejects weights that target undeclared results', () => {
  assert.throws(
    () =>
      parseQuizManifest({
        id: 'broken-content',
        slug: 'broken-content',
        status: 'draft',
        title: 'Broken Content',
        description: 'A broken fixture that references an undeclared result path.',
        results: [
          {
            id: 'declared-result',
            title: 'Declared Result',
            description: 'The only declared result in the broken manifest.',
          },
          {
            id: 'reachable-result',
            title: 'Reachable Result',
            description: 'Another declared result to satisfy minimum counts.',
          },
        ],
        questions: [
          {
            id: 'broken-question',
            prompt: 'Pick the option that points outside the declared result set.',
            options: [
              {
                id: 'broken-option',
                label: 'Reference a missing result.',
                weights: [{ resultId: 'missing-result', value: 2 }],
              },
              {
                id: 'reachable-option',
                label: 'Stay within the declared result set.',
                weights: [
                  { resultId: 'declared-result', value: 1 },
                  { resultId: 'reachable-result', value: 1 },
                ],
              },
            ],
          },
        ],
      }),
    /Every option weight must target a result declared by the same quiz\./,
  )
})

test('quiz manifest collection parsing rejects duplicate slugs', () => {
  assert.throws(
    () =>
      parseQuizManifestCollection([
        validManifest,
        {
          ...validManifest,
          id: 'content-fixture-duplicate',
        },
      ]),
    /Quiz manifest slugs must be unique across the content registry\./,
  )
})

test('published quizzes have complete, buildable image sets', () => {
  const publishedQuizzes = quizManifests.filter(
    (manifest) => manifest.status === 'published',
  )

  for (const quiz of publishedQuizzes) {
    const coverImage = getQuizCoverImage(quiz.slug)

    assert.ok(coverImage, `${quiz.slug} needs a cover image.`)
    assertImageExists(coverImage)

    if (coverImage.smallSrc) {
      assert.equal(
        existsSync(fileUrlForPublicAsset(coverImage.smallSrc)),
        true,
        `${coverImage.smallSrc} does not exist.`,
      )
    }

    for (const result of quiz.results) {
      const resultImage = getQuizResultImage(quiz.slug, result.id)

      assert.ok(resultImage, `${quiz.slug}:${result.id} needs a result image.`)
      assertImageExists(resultImage)
    }

    const questionImages = quiz.questions
      .map((question) => getQuizQuestionImage(quiz.slug, question.id))
      .filter((image): image is QuizImage => image !== null)

    assert.ok(
      questionImages.length >= 2,
      `${quiz.slug} needs images on at least two questions.`,
    )

    for (const questionImage of questionImages) {
      assertImageExists(questionImage)
    }
  }
})

function assertImageExists(image: QuizImage): void {
  assert.equal(
    existsSync(fileUrlForPublicAsset(image.src)),
    true,
    `${image.src} does not exist.`,
  )
  assert.equal(image.width, 1200)
  assert.equal(image.height, 800)
  assert.ok(image.alt.length > 20, `${image.src} needs useful alternative text.`)
}

function fileUrlForPublicAsset(assetPath: string): URL {
  return new URL(`../public${assetPath}`, import.meta.url)
}
