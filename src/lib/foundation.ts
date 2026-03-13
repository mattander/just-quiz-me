import * as v from 'valibot'

const foundationCardSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1)),
  description: v.pipe(v.string(), v.minLength(1)),
})

const foundationSnapshotSchema = v.object({
  badges: v.pipe(v.array(v.string()), v.minLength(1)),
  cards: v.pipe(v.array(foundationCardSchema), v.minLength(1)),
  notes: v.pipe(v.array(v.string()), v.minLength(1)),
  trackOptions: v.pipe(v.array(v.string()), v.minLength(1)),
})

export const foundationNameSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(2, 'Share your name so the team can tailor the next phase.'),
)

export const foundationEmailSchema = v.pipe(
  v.string(),
  v.trim(),
  v.email('Enter a valid email for Phase 1 updates.'),
)

const foundationTrackOptions = [
  'Landing page polish',
  'Quiz experience design',
  'Content operations flow',
]

export const foundationTrackSchema = v.picklist(
  foundationTrackOptions,
  'Choose the first Phase 1 area you want to explore.',
)

export const foundationInterestSchema = v.object({
  name: foundationNameSchema,
  email: foundationEmailSchema,
  track: foundationTrackSchema,
})

export type FoundationSnapshot = v.InferOutput<typeof foundationSnapshotSchema>
export type FoundationInterestInput = v.InferInput<
  typeof foundationInterestSchema
>

export const foundationSnapshot = v.parse(foundationSnapshotSchema, {
  badges: [
    'TanStack Start',
    'React 19',
    'TypeScript',
    'Vite 8',
    'Tailwind 4',
    'Cloudflare Workers',
  ],
  cards: [
    {
      title: 'TanStack Start app shell',
      description:
        'A real Start router now owns the document shell instead of a static HTML document.',
    },
    {
      title: 'React + TypeScript',
      description:
        'The UI is rendered through React components with strict TypeScript compiler settings.',
    },
    {
      title: 'Vite 8 target',
      description:
        'The build and local dev workflow now runs through the Vite 8 toolchain.',
    },
    {
      title: 'Tailwind foundation',
      description:
        'Utility classes and shared visual tokens power the responsive shell without extra config churn.',
    },
    {
      title: 'Cloudflare-ready output',
      description:
        'Wrangler deploys the built Start server bundle and static client assets from the same repo.',
    },
  ],
  notes: [
    'Router shell and landing surface live in React components.',
    'React Query is ready for cache-backed product data as Phase 1 grows.',
    'TanStack Form and Valibot now cover a real typed input boundary in the shell.',
  ],
  trackOptions: foundationTrackOptions,
})

export async function loadFoundationSnapshot(): Promise<FoundationSnapshot> {
  return foundationSnapshot
}
