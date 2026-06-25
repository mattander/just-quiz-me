const args = process.argv.slice(2)

function readFlag(name: string): string | null {
  const flagIndex = args.indexOf(`--${name}`)

  if (flagIndex === -1) {
    return null
  }

  return args[flagIndex + 1] ?? null
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-|-$/g, '')
}

function requireTitle(): string {
  const title = readFlag('title')

  if (!title) {
    throw new Error('Usage: npm run content:draft -- --title "Which..." [--slug quiz-slug]')
  }

  return title
}

const title = requireTitle()
const slug = readFlag('slug') ?? slugify(title)

if (!slug) {
  throw new Error('Quiz slug could not be derived. Provide --slug explicitly.')
}

const draft = {
  id: slug,
  slug,
  status: 'draft',
  title,
  description:
    'Replace this with one crisp sentence explaining the quiz premise and the emotional logic behind the joke.',
  results: [
    {
      id: 'result-one',
      title: 'Result One',
      description:
        'Write a specific result that feels funny because it follows from the quiz premise.',
    },
    {
      id: 'result-two',
      title: 'Result Two',
      description:
        'Write a second result with a different personality axis, not just a synonym.',
    },
    {
      id: 'result-three',
      title: 'Result Three',
      description:
        'Write a third result that gives the scoring model a clear alternative path.',
    },
  ],
  questions: [
    {
      id: 'opening-choice',
      prompt: 'Replace with a grounded situation that reveals quiz-relevant behavior.',
      options: [
        {
          id: 'first-path',
          label: 'An answer that clearly points toward Result One.',
          weights: [{ resultId: 'result-one', value: 3 }],
        },
        {
          id: 'second-path',
          label: 'An answer that clearly points toward Result Two.',
          weights: [{ resultId: 'result-two', value: 3 }],
        },
        {
          id: 'third-path',
          label: 'An answer that clearly points toward Result Three.',
          weights: [{ resultId: 'result-three', value: 3 }],
        },
      ],
    },
  ],
}

console.log(JSON.stringify(draft, null, 2))
