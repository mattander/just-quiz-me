import * as v from 'valibot'
import {
  parseGeneratedQuizDraftInput,
  parseQuizManifest,
  type GeneratedQuizDraftInput,
} from './quiz-manifest.ts'

export const defaultQuizGenerationModel = 'gpt-5.4-mini'

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

type JsonObject = { [key: string]: JsonValue }

type FetchClient = (url: string, init: RequestInit) => Promise<Response>

export type QuizGenerationRequest = {
  title: string
  premise: string
  slug: string
}

export type QuizGenerationSource = {
  identifier: string
  model: string
  prompt: string
  metadataJson?: string
}

export type OpenAiQuizGeneratorConfig = {
  apiKey: string
  model?: string
  fetchClient?: FetchClient
}

const openAiQuizResponseSchema = v.object({
  id: v.pipe(v.string(), v.trim(), v.minLength(1)),
  output_text: v.optional(v.pipe(v.string(), v.trim(), v.minLength(1))),
  output: v.optional(
    v.array(
      v.object({
        type: v.pipe(v.string(), v.trim(), v.minLength(1)),
        content: v.optional(
          v.array(
            v.object({
              type: v.pipe(v.string(), v.trim(), v.minLength(1)),
              text: v.optional(v.pipe(v.string(), v.trim(), v.minLength(1))),
            }),
          ),
        ),
      }),
    ),
  ),
})

export function buildQuizGenerationPrompt(request: QuizGenerationRequest): string {
  return [
    `Write a Just Quiz Me quiz manifest for: ${request.title}`,
    '',
    `Slug: ${request.slug}`,
    `Premise: ${request.premise}`,
    '',
    'Voice: dry, internet-native, specific, grounded absurdity.',
    'Structure: exactly 3 results, exactly 4 questions, exactly 3 options per question.',
    'Rules:',
    '- Return a complete quiz manifest object only.',
    "- Set status to 'draft'.",
    '- Keep ids and slug in lowercase kebab-case.',
    '- Questions must be coherent situations a person can actually imagine.',
    '- Options must map clearly to result personalities.',
    '- Results must be distinct, satisfying, and shareable.',
    '- Avoid random-for-randomness-sake zany nonsense.',
    '- Keep title and description concise enough for mobile surfaces.',
  ].join('\n')
}

export function buildOpenAiQuizGenerationRequest(
  request: QuizGenerationRequest,
  model: string,
): JsonObject {
  return {
    model,
    input: [
      {
        role: 'system',
        content:
          'You generate structured quiz manifests for Just Quiz Me. You are funny, coherent, and strict about schemas.',
      },
      {
        role: 'user',
        content: buildQuizGenerationPrompt(request),
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'just_quiz_me_quiz_manifest',
        strict: true,
        schema: quizManifestJsonSchema,
      },
    },
  }
}

export async function generateQuizDraftWithOpenAi(
  request: QuizGenerationRequest,
  sourceIdentifier: string,
  config: OpenAiQuizGeneratorConfig,
): Promise<GeneratedQuizDraftInput> {
  const model = config.model ?? defaultQuizGenerationModel
  const prompt = buildQuizGenerationPrompt(request)
  const response = await (config.fetchClient ?? fetch)(
    'https://api.openai.com/v1/responses',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildOpenAiQuizGenerationRequest(request, model)),
    },
  )

  if (!response.ok) {
    throw new Error(
      `OpenAI quiz generation failed with HTTP ${response.status}: ${await response.text()}`,
    )
  }

  const responseBody: unknown = await response.json()
  const parsedResponse = parseOpenAiQuizResponse(responseBody)
  const parsedOutput: unknown = JSON.parse(parsedResponse.outputText)
  const manifest = parseQuizManifest(parsedOutput)

  return parseGeneratedQuizDraftInput({
    manifest,
    source: {
      identifier: sourceIdentifier,
      model,
      prompt,
      metadataJson: JSON.stringify({
        provider: 'openai',
        responseId: parsedResponse.id,
        title: request.title,
        slug: request.slug,
      }),
    },
  })
}

function parseOpenAiQuizResponse(
  input: unknown,
): { id: string; outputText: string } {
  const result = v.safeParse(openAiQuizResponseSchema, input)

  if (!result.success) {
    throw new Error(`Invalid OpenAI quiz generation response.\n${v.summarize(result.issues)}`)
  }

  if (result.output.output_text) {
    return {
      id: result.output.id,
      outputText: result.output.output_text,
    }
  }

  const outputText = result.output.output
    ?.flatMap((item) => item.content ?? [])
    .find((content) => content.type === 'output_text' && content.text)?.text

  if (!outputText) {
    throw new Error('OpenAI quiz generation response did not include output text.')
  }

  return {
    id: result.output.id,
    outputText,
  }
}

const identifierSchema: JsonObject = {
  type: 'string',
  pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
}

const quizManifestJsonSchema: JsonObject = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'slug', 'status', 'title', 'description', 'results', 'questions'],
  properties: {
    id: identifierSchema,
    slug: identifierSchema,
    status: {
      type: 'string',
      enum: ['draft'],
    },
    title: {
      type: 'string',
      minLength: 3,
      maxLength: 120,
    },
    description: {
      type: 'string',
      minLength: 12,
      maxLength: 280,
    },
    results: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'title', 'description'],
        properties: {
          id: identifierSchema,
          title: {
            type: 'string',
            minLength: 3,
            maxLength: 120,
          },
          description: {
            type: 'string',
            minLength: 12,
            maxLength: 280,
          },
        },
      },
    },
    questions: {
      type: 'array',
      minItems: 4,
      maxItems: 4,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'prompt', 'options'],
        properties: {
          id: identifierSchema,
          prompt: {
            type: 'string',
            minLength: 8,
            maxLength: 200,
          },
          options: {
            type: 'array',
            minItems: 3,
            maxItems: 3,
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['id', 'label', 'weights'],
              properties: {
                id: identifierSchema,
                label: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 100,
                },
                weights: {
                  type: 'array',
                  minItems: 1,
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['resultId', 'value'],
                    properties: {
                      resultId: identifierSchema,
                      value: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 5,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}
