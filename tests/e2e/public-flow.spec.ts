import { expect, test } from '@playwright/test'

test('homepage to quiz to result flow stays playable', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Just Quiz Me has its first playable quiz',
    }),
  ).toBeVisible()

  await page.getByRole('link', { name: 'Play the featured quiz' }).click()
  await page.waitForLoadState('networkidle')

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Which Chaotic Breakfast Are You?',
    }),
  ).toBeVisible()

  await page.getByText('One alarm, one stretch, immediate competence.').click()
  await expect(
    page.locator('input[name="alarm-style"][value="one-alarm-and-up"]'),
  ).toBeChecked()

  await page.getByText('Calm, capable, and quietly getting it done.').click()
  await expect(
    page.locator('input[name="kitchen-energy"][value="calm-and-capable"]'),
  ).toBeChecked()

  await page.getByText('Nod kindly and continue being correct in private.').click()
  await expect(
    page.locator('input[name="social-bite"][value="nod-and-continue"]'),
  ).toBeChecked()

  await page.getByText('A very good knife that solves problems cleanly.').click()
  await expect(
    page.locator('input[name="comfort-object"][value="good-knife"]'),
  ).toBeChecked()

  await page.getByRole('button', { name: 'See my result' }).click()

  await expect(page).toHaveURL(
    /\/quiz\/which-chaotic-breakfast-are-you\/result\?resultId=buttered-toast&answered=4$/,
  )
  await expect(
    page.getByRole('heading', { level: 1, name: 'Buttered Toast' }),
  ).toBeVisible()
  await expect(page.getByText('You answered 4 of 4 questions in this round.')).toBeVisible()
})

test('invalid quiz routes fall into the not-found boundary', async ({ page }) => {
  await page.goto('/quiz/not-a-real-quiz')

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'This route has not been built yet.',
    }),
  ).toBeVisible()
  await expect(page.getByText('Not found')).toBeVisible()
})
