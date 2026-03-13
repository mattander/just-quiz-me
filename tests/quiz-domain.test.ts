import assert from 'node:assert/strict'
import test from 'node:test'
import {
  resolveCompletedQuizAnswers,
  scoreQuizAnswers,
} from '../src/lib/quiz-domain.ts'
import { quizManifests } from '../src/content/quizzes/index.ts'

const publishedQuiz = quizManifests[0]

if (!publishedQuiz) {
  throw new Error('Expected at least one authored quiz fixture.')
}

test('scoreQuizAnswers ranks results from the selected options', () => {
  const outcome = scoreQuizAnswers(publishedQuiz, [
    {
      questionId: 'alarm-style',
      optionId: 'one-alarm-and-up',
    },
    {
      questionId: 'kitchen-energy',
      optionId: 'calm-and-capable',
    },
    {
      questionId: 'social-bite',
      optionId: 'nod-and-continue',
    },
    {
      questionId: 'comfort-object',
      optionId: 'good-knife',
    },
  ])

  assert.equal(outcome.winningResult.resultId, 'buttered-toast')
  assert.equal(outcome.answeredQuestionCount, 4)
  assert.equal(outcome.results[0]?.score, 10)
})

test('resolveCompletedQuizAnswers rejects incomplete submissions', () => {
  assert.throws(
    () =>
      resolveCompletedQuizAnswers(publishedQuiz, [
        {
          questionId: 'alarm-style',
          optionId: 'one-alarm-and-up',
        },
      ]),
    /exactly one option for every question/,
  )
})
