import { expect, test, type Page } from '@playwright/test'

async function waitForAppHydration(page: Page): Promise<void> {
  await expect(page.locator('html')).toHaveAttribute('data-app-hydrated', 'true')
}

test('homepage to quiz to result flow stays playable', async ({ page }) => {
  await page.goto('/')
  await waitForAppHydration(page)

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Small, strange quizzes for people avoiding the group chat correctly.',
    }),
  ).toBeVisible()

  await page.getByRole('link', { name: 'Play this quiz' }).click()
  await expect(page).toHaveURL('/quiz/which-greek-god-would-block-you-on-slack')

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Which Greek God Would Block You on Slack?',
    }),
  ).toBeVisible()

  await page
    .locator('input[name="status-update"][value="bullet-list"]')
    .check()
  await expect(
    page.locator('input[name="status-update"][value="bullet-list"]'),
  ).toBeChecked()

  await page
    .locator('input[name="meeting-vibe"][value="diagram-it"]')
    .check()
  await expect(
    page.locator('input[name="meeting-vibe"][value="diagram-it"]'),
  ).toBeChecked()

  await page
    .locator('input[name="calendar-crime"][value="decline-with-context"]')
    .check()
  await expect(
    page.locator('input[name="calendar-crime"][value="decline-with-context"]'),
  ).toBeChecked()

  await page
    .locator('input[name="desk-object"][value="annotated-notebook"]')
    .check()
  await expect(
    page.locator('input[name="desk-object"][value="annotated-notebook"]'),
  ).toBeChecked()

  await page.getByRole('button', { name: 'See my result' }).click()

  await expect(page).toHaveURL(
    /\/quiz\/which-greek-god-would-block-you-on-slack\/result\?resultId=athena&answered=4$/,
  )
  await expect(
    page.getByRole('heading', { level: 1, name: 'Athena' }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Share this result' })).toBeVisible()
  await expect(page.getByText('You answered 4 of 4 questions in this round.')).toBeVisible()
})

test('theme toggle defaults to system theme and supports a persisted override', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.clear()
  })
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await waitForAppHydration(page)

  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/)
  expect(
    await page.evaluate(() => window.localStorage.getItem('justquizme-theme')),
  ).toBeNull()

  const themeToggle = page.getByRole('button', {
    name: /Switch to (light|dark) theme/,
  })
  await expect(themeToggle).toBeVisible()
  await expect(themeToggle).toHaveAttribute('aria-label', 'Switch to light theme')
  await expect(themeToggle).toHaveAttribute('aria-pressed', 'true')
  await expect(
    themeToggle.locator('[data-theme-icon="dark"]'),
  ).toHaveAttribute('data-active', 'true')
  await expect(
    themeToggle.locator('[data-theme-icon="light"]'),
  ).toHaveAttribute('data-active', 'false')

  const initialButtonLabel = await themeToggle.getAttribute('aria-label')
  const overrideTheme =
    initialButtonLabel === 'Switch to light theme' ? 'light' : 'dark'
  const overrideButtonLabel =
    overrideTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'

  await themeToggle.click()

  await expect(page.locator('html')).toHaveAttribute('data-theme', overrideTheme)
  await expect(page.getByRole('button', { name: overrideButtonLabel })).toBeVisible()
  expect(
    await page.evaluate(() => window.localStorage.getItem('justquizme-theme')),
  ).toBe(overrideTheme)
})

test('invalid quiz routes fall into the not-found boundary', async ({ page }) => {
  await page.goto('/quiz/not-a-real-quiz')

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'That quiz wandered off.',
    }),
  ).toBeVisible()
  await expect(page.getByText('Not found')).toBeVisible()
})
