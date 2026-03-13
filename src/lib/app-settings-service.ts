import { createServerFn } from '@tanstack/react-start'
import { createAppSettingsRepository } from './app-settings-repository.ts'
import { getAppRequestContext } from './server-context.ts'

export const getAppSettings = createServerFn({ method: 'GET' }).handler(
  async ({ context }) => {
    const requestContext = getAppRequestContext(context)
    const repository = createAppSettingsRepository(
      requestContext.cloudflare.bindings.QUIZ_DB,
    )

    return repository.read()
  },
)
