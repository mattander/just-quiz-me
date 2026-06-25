import { expect, test } from '@playwright/test'

test('homepage to quiz to result flow stays playable', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Strange little quizzes with immediate consequences.',
    }),
  ).toBeVisible()

  await page.getByRole('link', { name: 'Play the featured quiz' }).click()
  await page.waitForLoadState('networkidle')

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Which Greek God Would Block You on Slack?',
    }),
  ).toBeVisible()

  await page.getByText('Three tidy bullets, one risk, and a next step.').click()
  await expect(
    page.locator('input[name="status-update"][value="bullet-list"]'),
  ).toBeChecked()

  await page.getByText('Draw the hidden structure and make the room face it.').click()
  await expect(
    page.locator('input[name="meeting-vibe"][value="diagram-it"]'),
  ).toBeChecked()

  await page.getByText('Decline with a polite explanation and a better alternative.').click()
  await expect(
    page.locator('input[name="calendar-crime"][value="decline-with-context"]'),
  ).toBeChecked()

  await page.getByText('A notebook full of plans, arrows, and judgment.').click()
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
  await expect(page.getByText('You answered 4 of 4 questions in this round.')).toBeVisible()
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
