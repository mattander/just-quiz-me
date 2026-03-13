import assert from 'node:assert/strict'
import test from 'node:test'
import { seededAppSettings } from '../src/content/settings/index.ts'
import {
  buildHomepageQuizFeed,
  getPublishedQuizBySlug,
  listPublishedQuizzes,
  scoreQuizAnswers,
} from '../src/lib/quiz-domain.ts'
import {
  defineQuizManifest,
  defineQuizManifestCollection,
} from '../src/lib/quiz-manifest.ts'

const manifestCollection = defineQuizManifestCollection([
  {
    id: 'featured-quiz',
    slug: 'featured-quiz',
    status: 'published',
    title: 'Featured Quiz',
    description: 'A published fixture for homepage and scoring tests.',
    results: [
      {
        id: 'steady',
        title: 'Steady',
        description: 'A calm and careful result path.',
      },
      {
        id: 'spark',
        title: 'Spark',
        description: 'A louder and more spontaneous result path.',
      },
    ],
    questions: [
      {
        id: 'opening-move',
        prompt: 'How do you begin when the fixture starts?',
        options: [
          {
            id: 'careful-start',
            label: 'With a careful plan and a checklist.',
            weights: [{ resultId: 'steady', value: 2 }],
          },
          {
            id: 'bold-start',
            label: 'With momentum and a dramatic entrance.',
            weights: [{ resultId: 'spark', value: 2 }],
          },
        ],
      },
      {
        id: 'second-move',
        prompt: 'How do you respond when the plan changes?',
        options: [
          {
            id: 'steady-response',
            label: 'Adjust quietly and keep going.',
            weights: [{ resultId: 'steady', value: 3 }],
          },
          {
            id: 'spark-response',
            label: 'Treat it like a fresh opportunity.',
            weights: [{ resultId: 'spark', value: 3 }],
          },
        ],
      },
    ],
  },
  {
    id: 'secondary-quiz',
    slug: 'secondary-quiz',
    status: 'published',
    title: 'Secondary Quiz',
    description: 'Another published fixture for feed ordering assertions.',
    results: [
      {
        id: 'left',
        title: 'Left',
        description: 'A secondary fixture result.',
      },
      {
        id: 'right',
        title: 'Right',
        description: 'Another secondary fixture result.',
      },
    ],
    questions: [
      {
        id: 'side',
        prompt: 'Pick a side for the secondary fixture.',
        options: [
          {
            id: 'left-option',
            label: 'Choose the left path.',
            weights: [{ resultId: 'left', value: 2 }],
          },
          {
            id: 'right-option',
            label: 'Choose the right path.',
            weights: [{ resultId: 'right', value: 2 }],
          },
        ],
      },
    ],
  },
  {
    id: 'draft-quiz',
    slug: 'draft-quiz',
    status: 'draft',
    title: 'Draft Quiz',
    description: 'A draft fixture that should stay out of published surfaces.',
    results: [
      {
        id: 'hidden-left',
        title: 'Hidden Left',
        description: 'A draft-only result.',
      },
      {
        id: 'hidden-right',
        title: 'Hidden Right',
        description: 'Another draft-only result.',
      },
    ],
    questions: [
      {
        id: 'draft-side',
        prompt: 'Pick a side for the draft fixture.',
        options: [
          {
            id: 'draft-left',
            label: 'Choose the hidden left path.',
            weights: [{ resultId: 'hidden-left', value: 2 }],
          },
          {
            id: 'draft-right',
            label: 'Choose the hidden right path.',
            weights: [{ resultId: 'hidden-right', value: 2 }],
          },
        ],
      },
    ],
  },
])

const tieBreakerQuiz = defineQuizManifest({
  id: 'tie-breaker-quiz',
  slug: 'tie-breaker-quiz',
  status: 'published',
  title: 'Tie Breaker Quiz',
  description: 'A published fixture that produces a deterministic scoring tie.',
  results: [
    {
      id: 'alpha',
      title: 'Alpha',
      description: 'First in manifest order.',
    },
    {
      id: 'beta',
      title: 'Beta',
      description: 'Second in manifest order.',
    },
  ],
  questions: [
    {
      id: 'balanced',
      prompt: 'Pick the answer that balances both outcomes.',
      options: [
        {
          id: 'balanced-option',
          label: 'Score both outcomes equally.',
          weights: [
            { resultId: 'alpha', value: 2 },
            { resultId: 'beta', value: 2 },
          ],
        },
        {
          id: 'beta-option',
          label: 'Favor the second outcome slightly.',
          weights: [{ resultId: 'beta', value: 3 }],
        },
      ],
    },
  ],
})

test('published quiz helpers exclude drafts and hide draft slug lookups', () => {
  const publishedQuizzes = listPublishedQuizzes(manifestCollection)

  assert.deepEqual(
    publishedQuizzes.map((manifest) => manifest.slug),
    ['featured-quiz', 'secondary-quiz'],
  )
  assert.equal(getPublishedQuizBySlug(manifestCollection, 'featured-quiz')?.id, 'featured-quiz')
  assert.equal(getPublishedQuizBySlug(manifestCollection, 'draft-quiz'), null)
})

test('homepage feed honors featured settings and falls back to the first published quiz', () => {
  const configuredFeed = buildHomepageQuizFeed(manifestCollection, {
    ...seededAppSettings,
    featuredQuizSlug: 'secondary-quiz',
  })

  assert.equal(configuredFeed.featuredQuiz?.slug, 'secondary-quiz')
  assert.deepEqual(
    configuredFeed.quizzes.map((manifest) => manifest.slug),
    ['featured-quiz'],
  )

  const fallbackFeed = buildHomepageQuizFeed(manifestCollection, {
    ...seededAppSettings,
    featuredQuizSlug: 'missing-quiz',
  })

  assert.equal(fallbackFeed.featuredQuiz?.slug, 'featured-quiz')
  assert.deepEqual(
    fallbackFeed.quizzes.map((manifest) => manifest.slug),
    ['secondary-quiz'],
  )
})

test('homepage feed respects a zero limit and handles empty published collections', () => {
  const limitedFeed = buildHomepageQuizFeed(manifestCollection, seededAppSettings, 0)

  assert.equal(limitedFeed.featuredQuiz?.slug, 'featured-quiz')
  assert.deepEqual(limitedFeed.quizzes, [])

  const emptyFeed = buildHomepageQuizFeed(
    defineQuizManifestCollection([
      {
        ...manifestCollection[2],
      },
    ]),
    seededAppSettings,
  )

  assert.equal(emptyFeed.featuredQuiz, null)
  assert.deepEqual(emptyFeed.quizzes, [])
})

test('quiz scoring accumulates weights, reports answered count, and exposes ties', () => {
  const score = scoreQuizAnswers(manifestCollection[0], [
    {
      questionId: 'opening-move',
      optionId: 'careful-start',
    },
    {
      questionId: 'second-move',
      optionId: 'steady-response',
    },
  ])

  assert.equal(score.quizId, 'featured-quiz')
  assert.equal(score.winningResult.resultId, 'steady')
  assert.equal(score.winningResult.score, 5)
  assert.equal(score.answeredQuestionCount, 2)
  assert.deepEqual(
    score.results.map((result) => ({
      id: result.resultId,
      rank: result.rank,
      score: result.score,
    })),
    [
      { id: 'steady', rank: 1, score: 5 },
      { id: 'spark', rank: 2, score: 0 },
    ],
  )

  const tieScore = scoreQuizAnswers(tieBreakerQuiz, [
    {
      questionId: 'balanced',
      optionId: 'balanced-option',
    },
  ])

  assert.equal(tieScore.winningResult.resultId, 'alpha')
  assert.deepEqual(tieScore.winningResult.tiedResultIds, ['alpha', 'beta'])
})

test('quiz scoring rejects duplicate questions and unknown answers', () => {
  assert.throws(
    () =>
      scoreQuizAnswers(manifestCollection[0], [
        {
          questionId: 'opening-move',
          optionId: 'careful-start',
        },
        {
          questionId: 'opening-move',
          optionId: 'bold-start',
        },
      ]),
    /Quiz answers must include at most one option per question\./,
  )

  assert.throws(
    () =>
      scoreQuizAnswers(manifestCollection[0], [
        {
          questionId: 'missing-question',
          optionId: 'careful-start',
        },
      ]),
    /Answer references unknown question "missing-question"\./,
  )

  assert.throws(
    () =>
      scoreQuizAnswers(manifestCollection[0], [
        {
          questionId: 'opening-move',
          optionId: 'missing-option',
        },
      ]),
    /Answer "missing-option" does not exist on question "opening-move"\./,
  )
})
