import * as v from 'valibot'

const editorialIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const manifestIdentifierSchema = v.pipe(
  v.string(),
  v.trim(),
  v.regex(
    editorialIdPattern,
    'Use lowercase kebab-case identifiers so manifests stay stable across code and storage.',
  ),
)

const titleSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(3, 'Titles must be specific enough to edit with confidence.'),
  v.maxLength(120, 'Keep titles concise enough for quiz surfaces and admin tooling.'),
)

const summarySchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(12, 'Descriptions should give future editors enough context.'),
  v.maxLength(
    280,
    'Descriptions should stay short enough to reuse in cards, previews, and admin surfaces.',
  ),
)

const promptSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(8, 'Question prompts should read like real quiz copy.'),
  v.maxLength(200, 'Question prompts should stay scan-friendly.'),
)

const optionLabelSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, 'Options need visible copy.'),
  v.maxLength(100, 'Options should stay compact enough for mobile layouts.'),
)

const weightSchema = v.object({
  resultId: manifestIdentifierSchema,
  value: v.pipe(
    v.number(),
    v.integer('Weight values must be whole numbers.'),
    v.minValue(1, 'Weight values must be positive.'),
    v.maxValue(5, 'Weight values should stay in a small editorial range.'),
  ),
})

const questionOptionSchema = v.pipe(
  v.object({
    id: manifestIdentifierSchema,
    label: optionLabelSchema,
    weights: v.pipe(
      v.array(weightSchema),
      v.minLength(1, 'Every option must contribute to at least one result.'),
    ),
  }),
  v.check(
    (option) =>
      new Set(option.weights.map((weight) => weight.resultId)).size ===
      option.weights.length,
    'Each option can weight a given result only once.',
  ),
)

const quizResultSchema = v.object({
  id: manifestIdentifierSchema,
  title: titleSchema,
  description: summarySchema,
})

const quizQuestionSchema = v.pipe(
  v.object({
    id: manifestIdentifierSchema,
    prompt: promptSchema,
    options: v.pipe(
      v.array(questionOptionSchema),
      v.minLength(2, 'Each question needs at least two answer options.'),
      v.maxLength(8, 'Keep question options focused and editable.'),
    ),
  }),
  v.check(
    (question) =>
      new Set(question.options.map((option) => option.id)).size ===
      question.options.length,
    'Option identifiers must be unique within a question.',
  ),
)

export const quizManifestSchema = v.pipe(
  v.object({
    id: manifestIdentifierSchema,
    slug: manifestIdentifierSchema,
    status: v.picklist(['draft', 'published']),
    title: titleSchema,
    description: summarySchema,
    results: v.pipe(
      v.array(quizResultSchema),
      v.minLength(2, 'A quiz needs at least two possible results.'),
      v.maxLength(12, 'Keep result sets compact enough to edit and score clearly.'),
    ),
    questions: v.pipe(
      v.array(quizQuestionSchema),
      v.minLength(1, 'A quiz needs at least one question.'),
      v.maxLength(20, 'Keep quiz manifests manageable for editorial review.'),
    ),
  }),
  v.check(
    (manifest) =>
      new Set(manifest.results.map((result) => result.id)).size ===
      manifest.results.length,
    'Result identifiers must be unique within a quiz.',
  ),
  v.check(
    (manifest) =>
      new Set(manifest.questions.map((question) => question.id)).size ===
      manifest.questions.length,
    'Question identifiers must be unique within a quiz.',
  ),
  v.check(
    (manifest) => {
      const resultIds = new Set(manifest.results.map((result) => result.id))

      return manifest.questions.every((question) =>
        question.options.every((option) =>
          option.weights.every((weight) => resultIds.has(weight.resultId)),
        ),
      )
    },
    'Every option weight must target a result declared by the same quiz.',
  ),
  v.check(
    (manifest) => {
      const referencedResultIds = new Set(
        manifest.questions.flatMap((question) =>
          question.options.flatMap((option) =>
            option.weights.map((weight) => weight.resultId),
          ),
        ),
      )

      return manifest.results.every((result) => referencedResultIds.has(result.id))
    },
    'Every result must be reachable from at least one option weight.',
  ),
  v.check(
    (manifest) =>
      manifest.questions.every((question) => {
        const referencedResultIds = new Set(
          question.options.flatMap((option) =>
            option.weights.map((weight) => weight.resultId),
          ),
        )

        return referencedResultIds.size >= 2
      }),
    'Each question should discriminate between at least two result paths.',
  ),
)

export const quizManifestCollectionSchema = v.pipe(
  v.array(quizManifestSchema),
  v.check(
    (manifests) =>
      new Set(manifests.map((manifest) => manifest.id)).size === manifests.length,
    'Quiz manifest identifiers must be unique across the content registry.',
  ),
  v.check(
    (manifests) =>
      new Set(manifests.map((manifest) => manifest.slug)).size === manifests.length,
    'Quiz manifest slugs must be unique across the content registry.',
  ),
)

const sourceIdentifierSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, 'Generated draft source identifiers cannot be empty.'),
  v.maxLength(160, 'Generated draft source identifiers should stay log-friendly.'),
)

const sourceModelSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, 'Generated draft source models cannot be empty.'),
  v.maxLength(120, 'Generated draft source models should stay compact.'),
)

const sourcePromptSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, 'Generated draft source prompts cannot be empty.'),
  v.maxLength(4000, 'Generated draft source prompts should stay reviewable.'),
)

const sourceMetadataJsonSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(2, 'Generated draft source metadata must be valid JSON text.'),
  v.maxLength(8000, 'Generated draft source metadata should stay compact.'),
  v.check((value) => {
    try {
      JSON.parse(value)
      return true
    } catch {
      return false
    }
  }, 'Generated draft source metadata must be valid JSON text.'),
)

export const generatedQuizDraftInputSchema = v.pipe(
  v.object({
    manifest: quizManifestSchema,
    source: v.object({
      identifier: sourceIdentifierSchema,
      model: sourceModelSchema,
      prompt: v.optional(sourcePromptSchema),
      metadataJson: v.optional(sourceMetadataJsonSchema),
    }),
  }),
  v.check(
    (draft) => draft.manifest.status === 'draft',
    'Generated quiz drafts must use draft status until explicitly reviewed and published.',
  ),
)

export type QuizManifest = v.InferOutput<typeof quizManifestSchema>
export type QuizManifestCollection = v.InferOutput<
  typeof quizManifestCollectionSchema
>
export type GeneratedQuizDraftInput = v.InferOutput<
  typeof generatedQuizDraftInputSchema
>

export function parseQuizManifest(input: unknown): QuizManifest {
  const result = v.safeParse(quizManifestSchema, input)

  if (!result.success) {
    throw new Error(`Invalid quiz manifest.\n${v.summarize(result.issues)}`)
  }

  return result.output
}

export function parseQuizManifestCollection(
  input: unknown,
): QuizManifestCollection {
  const result = v.safeParse(quizManifestCollectionSchema, input)

  if (!result.success) {
    throw new Error(`Invalid quiz manifest collection.\n${v.summarize(result.issues)}`)
  }

  return result.output
}

export function parseGeneratedQuizDraftInput(
  input: unknown,
): GeneratedQuizDraftInput {
  const result = v.safeParse(generatedQuizDraftInputSchema, input)

  if (!result.success) {
    throw new Error(`Invalid generated quiz draft.\n${v.summarize(result.issues)}`)
  }

  return result.output
}

export function defineQuizManifest(input: unknown): QuizManifest {
  return parseQuizManifest(input)
}

export function defineQuizManifestCollection(
  input: unknown,
): QuizManifestCollection {
  return parseQuizManifestCollection(input)
}
