import { createServerFn } from '@tanstack/react-start'
import { createAppSettingsRepository } from './app-settings-repository.ts'

export const getAppSettings = createServerFn({ method: 'GET' }).handler(
  async ({ context }) => {
    const repository = createAppSettingsRepository(context.cloudflare.bindings.QUIZ_DB)

    return repository.read()
  },
)
