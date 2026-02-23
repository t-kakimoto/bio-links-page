import { expect, test } from '@playwright/test';

test.describe('bio links smoke', () => {
  test('renders profile and link cards on desktop', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.profile-name')).toBeVisible();

    const cardCount = await page.locator('a.link-card').count();
    expect(cardCount).toBeGreaterThan(0);

    const sectionHeaderCount = await page.locator('.link-section-header').count();
    expect(sectionHeaderCount).toBeGreaterThan(0);

    const attrs = await page
      .locator('a.link-card')
      .evaluateAll((anchors) =>
        anchors.map((anchor) => ({
          target: anchor.getAttribute('target'),
          rel: anchor.getAttribute('rel') ?? '',
        })),
      );

    attrs.forEach((item) => {
      expect(item.target).toBe('_blank');
      expect(item.rel).toContain('noopener');
      expect(item.rel).toContain('noreferrer');
    });
  });

  test('renders only https links for link cards', async ({ page }) => {
    await page.goto('/');

    const hrefs = await page
      .locator('a.link-card')
      .evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href') ?? ''));

    hrefs.forEach((href) => {
      expect(href.startsWith('https://')).toBeTruthy();
    });
  });

  test('applies icon tone/style classes to variants', async ({ page }) => {
    await page.goto('/');

    const spotlightIcon = page.locator('.link-card--spotlight .link-icon-wrap').first();
    const xIcon = page.locator('.link-card--x .link-icon-wrap').first();
    const corporateIcon = page.locator('.link-card--corporate .link-icon-wrap').first();

    await expect(spotlightIcon).toHaveClass(/link-icon-wrap--tone-default/);
    await expect(spotlightIcon).toHaveClass(/link-icon-wrap--style-outline/);
    await expect(xIcon).toHaveClass(/link-icon-wrap--style-outline/);
    await expect(corporateIcon).toHaveClass(/link-icon-wrap--tone-default/);
  });

  test('does not render X-specific right-side badge element', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.x-badge')).toHaveCount(0);
  });

  test('does not render External helper text in any link card', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.link-card .link-meta')).toHaveCount(0);
  });

  test('does not render profile bio element when bio is empty', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.profile-bio')).toHaveCount(0);
  });

  test('hides QR dock and keeps layout inside viewport on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.locator('#qr-desktop')).toBeHidden();

    const widthFits = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    );

    expect(widthFits).toBeTruthy();
  });

  test('keyboard tab reaches link cards and skips section header', async ({ page }) => {
    await page.goto('/');
    await page.locator('body').click();
    await page.keyboard.press('Tab');

    const active = await page.evaluate(() => {
      const element = document.activeElement as HTMLElement | null;

      return {
        tagName: element?.tagName,
        className: element?.className ?? '',
      };
    });

    expect(active.tagName).toBe('A');
    expect(active.className).toContain('link-card');
    expect(active.className).not.toContain('link-section-header');
  });

  test('icon-lab page renders all icon cards', async ({ page }) => {
    await page.goto('/icon-lab/');

    await expect(page.getByRole('heading', { name: 'Icon Lab' })).toBeVisible();
    await expect(page.locator('.icon-lab-card')).toHaveCount(8);
  });
});
