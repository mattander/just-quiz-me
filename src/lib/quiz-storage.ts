export const seededQuizRevisionNumber = 1

function revisionNumberFragment(revisionNumber: number): string {
  return revisionNumber.toString().padStart(4, '0')
}

export function editorialQuizRowId(quizId: string): string {
  return `quiz:${quizId}`
}

export function quizRevisionRowId(
  quizId: string,
  revisionNumber: number,
): string {
  return `${editorialQuizRowId(quizId)}:revision:${revisionNumberFragment(revisionNumber)}`
}

export function quizRevisionResultRowId(
  quizId: string,
  revisionNumber: number,
  resultId: string,
): string {
  return `${quizRevisionRowId(quizId, revisionNumber)}:result:${resultId}`
}

export function quizRevisionQuestionRowId(
  quizId: string,
  revisionNumber: number,
  questionId: string,
): string {
  return `${quizRevisionRowId(quizId, revisionNumber)}:question:${questionId}`
}

export function quizRevisionOptionRowId(
  quizId: string,
  revisionNumber: number,
  questionId: string,
  optionId: string,
): string {
  return `${quizRevisionQuestionRowId(
    quizId,
    revisionNumber,
    questionId,
  )}:option:${optionId}`
}
