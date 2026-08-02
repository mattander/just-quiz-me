import {
  Outlet,
  createFileRoute,
  notFound,
  redirect,
  useChildMatches,
} from '@tanstack/react-router'
import { QuizPlayPage } from '../components/quiz-play-page.tsx'
import { getQuizCoverImage } from '../content/quiz-images.ts'
import {
  resolveCompletedQuizAnswers,
  type QuizAnswerSelection,
} from '../lib/quiz-domain.ts'
import { getRuntimeConfig } from '../lib/runtime-config.ts'
import { readPublishedQuiz } from '../lib/quiz-service.ts'
import {
  buildAbsoluteUrl,
  createCanonicalLinks,
  createPageMetadata,
} from '../lib/seo.ts'

export const Route = createFileRoute('/quiz/$quizSlug')({
  loader: async ({ params, location }) => {
    const [quiz, runtimeConfig] = await Promise.all([
      readPublishedQuiz({
        data: {
          quizSlug: params.quizSlug,
        },
      }),
      getRuntimeConfig(),
    ])

    if (!quiz) {
      throw notFound()
    }

    const submittedAnswers = parseSubmittedAnswers(
      quiz.questions.map((question) => question.id),
      new URL(location.href, runtimeConfig.publicSiteUrl).search,
    )

    if (submittedAnswers.length === quiz.questions.length) {
      const outcome = resolveCompletedQuizAnswers(
        quiz,
        submittedAnswers satisfies readonly QuizAnswerSelection[],
      )

      throw redirect({
        to: '/quiz/$quizSlug/result',
        params: {
          quizSlug: quiz.slug,
        },
        search: {
          resultId: outcome.winningResult.resultId,
          answered: outcome.answeredQuestionCount,
        },
      })
    }

    return {
      quiz,
      siteUrl: runtimeConfig.publicSiteUrl,
    }
  },
  head: ({ loaderData, match, matches }) => {
    if (!loaderData) {
      return {}
    }

    const leafMatch = matches[matches.length - 1]

    if (!leafMatch || leafMatch.id !== match.id) {
      return {}
    }

    const canonicalUrl = buildAbsoluteUrl(
      loaderData.siteUrl,
      `/quiz/${loaderData.quiz.slug}`,
    )
    const coverImage = getQuizCoverImage(loaderData.quiz.slug)

    return {
      meta: createPageMetadata({
        title: `${loaderData.quiz.title} | Just Quiz Me`,
        description: loaderData.quiz.description,
        canonicalUrl,
        ...(coverImage
          ? {
              imageUrl: buildAbsoluteUrl(loaderData.siteUrl, coverImage.src),
              imageAlt: coverImage.alt,
              imageWidth: coverImage.width,
              imageHeight: coverImage.height,
            }
          : {}),
      }),
      links: createCanonicalLinks(canonicalUrl),
    }
  },
  component: QuizRouteShell,
})

function QuizRouteShell() {
  const { quiz } = Route.useLoaderData()
  const childMatches = useChildMatches()

  if (childMatches.length > 0) {
    return <Outlet />
  }

  return <QuizPlayPage quiz={quiz} />
}

function parseSubmittedAnswers(
  questionIds: readonly string[],
  search: string,
): QuizAnswerSelection[] {
  const searchParams = new URLSearchParams(search)
  const answers: QuizAnswerSelection[] = []

  for (const questionId of questionIds) {
    const optionId = searchParams.get(questionId)

    if (!optionId) {
      continue
    }

    answers.push({
      questionId,
      optionId,
    })
  }

  return answers
}
