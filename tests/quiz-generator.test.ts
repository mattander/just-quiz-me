import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildOpenAiQuizGenerationRequest,
  defaultQuizGenerationModel,
  generateQuizDraftWithOpenAi,
} from '../src/lib/openai-quiz-generator.ts'

const validGeneratedManifest = {
  id: 'which-office-plant-knows-too-much',
  slug: 'which-office-plant-knows-too-much',
  status: 'draft',
  title: 'Which Office Plant Knows Too Much?',
  description:
    'A suspiciously leafy quiz about workplace secrets, ambient listening, and photosynthesis with an agenda.',
  results: [
    {
      id: 'peace-lily-in-legal',
      title: 'Peace Lily in Legal',
      description:
        'You absorb conflict through the air and somehow always know which meeting should have been an email.',
    },
    {
      id: 'snake-plant-by-printer',
      title: 'Snake Plant by the Printer',
      description:
        'You are low maintenance, impossible to impress, and present for every confidential toner incident.',
    },
    {
      id: 'fern-with-receipts',
      title: 'Fern With Receipts',
      description:
        'You look decorative until someone asks for the timeline, and then the whole room gets very quiet.',
    },
  ],
  questions: [
    {
      id: 'confidential-vibe',
      prompt: 'A coworker whispers near your leaves. What do you do?',
      options: [
        {
          id: 'document-everything',
          label: 'Remain still, collect context, and develop a private timeline.',
          weights: [{ resultId: 'peace-lily-in-legal', value: 3 }],
        },
        {
          id: 'jam-printer',
          label: 'Cause a printer jam at exactly the funniest possible moment.',
          weights: [{ resultId: 'snake-plant-by-printer', value: 3 }],
        },
        {
          id: 'produce-receipts',
          label: 'Rustle softly because you have receipts and chlorophyll.',
          weights: [{ resultId: 'fern-with-receipts', value: 3 }],
        },
      ],
    },
    {
      id: 'meeting-room',
      prompt: 'Someone books the small meeting room for a secret chat. Your role?',
      options: [
        {
          id: 'legal-adjacent',
          label: 'Become legally adjacent and emotionally unavailable.',
          weights: [{ resultId: 'peace-lily-in-legal', value: 2 }],
        },
        {
          id: 'printer-alibi',
          label: 'Develop a printer-related alibi no one asked for.',
          weights: [{ resultId: 'snake-plant-by-printer', value: 2 }],
        },
        {
          id: 'timeline-energy',
          label: 'Quietly update the timeline you allegedly do not keep.',
          weights: [{ resultId: 'fern-with-receipts', value: 2 }],
        },
      ],
    },
    {
      id: 'watering-day',
      prompt: 'It is watering day and morale is strange. What do you absorb?',
      options: [
        {
          id: 'policy-murmurs',
          label: 'Policy murmurs, calendar dread, and one suspicious apology.',
          weights: [{ resultId: 'peace-lily-in-legal', value: 2 }],
        },
        {
          id: 'toner-chaos',
          label: 'Toner chaos and the smell of someone pretending not to panic.',
          weights: [{ resultId: 'snake-plant-by-printer', value: 2 }],
        },
        {
          id: 'forensic-moisture',
          label: 'Forensic moisture and a Slack thread with motive.',
          weights: [{ resultId: 'fern-with-receipts', value: 2 }],
        },
      ],
    },
    {
      id: 'after-hours',
      prompt: 'The office goes quiet after hours. What remains?',
      options: [
        {
          id: 'boundary-energy',
          label: 'Boundary energy and one unread policy draft.',
          weights: [{ resultId: 'peace-lily-in-legal', value: 2 }],
        },
        {
          id: 'mechanical-humming',
          label: 'Mechanical humming from a printer with unresolved feelings.',
          weights: [{ resultId: 'snake-plant-by-printer', value: 2 }],
        },
        {
          id: 'evidence-aura',
          label: 'An evidence aura no one can prove but everyone respects.',
          weights: [{ resultId: 'fern-with-receipts', value: 2 }],
        },
      ],
    },
  ],
}

test('OpenAI request targets structured quiz manifest output', () => {
  const requestBody = buildOpenAiQuizGenerationRequest(
    {
      title: 'Which Office Plant Knows Too Much?',
      premise: 'A quiz about office plants silently collecting workplace secrets.',
      slug: 'which-office-plant-knows-too-much',
    },
    defaultQuizGenerationModel,
  )

  assert.equal(requestBody.model, 'gpt-5.4-mini')
  const serializedRequest = JSON.stringify(requestBody)

  assert.match(serializedRequest, /json_schema/)
  assert.match(serializedRequest, /just_quiz_me_quiz_manifest/)
  assert.match(serializedRequest, /which-office-plant-knows-too-much/)
})

test('OpenAI generator validates model output into a generated draft payload', async () => {
  const draft = await generateQuizDraftWithOpenAi(
    {
      title: 'Which Office Plant Knows Too Much?',
      premise: 'A quiz about office plants silently collecting workplace secrets.',
      slug: 'which-office-plant-knows-too-much',
    },
    'github-actions:123:which-office-plant-knows-too-much',
    {
      apiKey: 'test-key',
      fetchClient: async () =>
        new Response(
          JSON.stringify({
            id: 'resp_test',
            output: [
              {
                type: 'message',
                content: [
                  {
                    type: 'output_text',
                    text: JSON.stringify(validGeneratedManifest),
                  },
                ],
              },
            ],
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
    },
  )

  assert.equal(draft.manifest.status, 'draft')
  assert.equal(draft.manifest.slug, 'which-office-plant-knows-too-much')
  assert.equal(
    draft.source.identifier,
    'github-actions:123:which-office-plant-knows-too-much',
  )
  assert.equal(draft.source.model, 'gpt-5.4-mini')
  assert.match(draft.source.metadataJson ?? '', /resp_test/)
})

test('OpenAI generator rejects invalid structured output', async () => {
  await assert.rejects(
    generateQuizDraftWithOpenAi(
      {
        title: 'Which Office Plant Knows Too Much?',
        premise: 'A quiz about office plants silently collecting workplace secrets.',
        slug: 'which-office-plant-knows-too-much',
      },
      'github-actions:123:which-office-plant-knows-too-much',
      {
        apiKey: 'test-key',
        fetchClient: async () =>
          new Response(
            JSON.stringify({
              id: 'resp_test',
              output: [
                {
                  type: 'message',
                  content: [
                    {
                      type: 'output_text',
                      text: JSON.stringify({
                        ...validGeneratedManifest,
                        status: 'published',
                      }),
                    },
                  ],
                },
              ],
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            },
          ),
      },
    ),
    /Generated quiz drafts must use draft status/,
  )
})
