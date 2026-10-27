import { expect, test } from "@playwright/test";
import { waitForHydration } from "./helpers/hydration";

// F18：`hidden lg:flex` 係全站寫法，所以喺 `lg` 以下**成個網站**都冇導覽。
// 呢個 spec 釘住修法：窄screen 有個掣，撳到開個原生 modal 抽屜，Escape / 關掣
// 都收得返，而且 focus 要還返俾個掣。

const trigger = "[data-site-menu-trigger]";
const drawer = "[data-site-mobile-nav]";
const closeButton = "[data-site-menu-close]";

test.describe("narrow screens", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/pos?lang=en");
    await waitForHydration(page, page.locator(trigger));
  });

  test("the menu button opens a modal drawer, and Escape hands focus back", async ({ page }) => {
    await expect(page.locator(trigger)).toBeVisible();
    // 完整 nav 仍然係收起嘅 —— 個抽屜係佢嘅替代品，唔係多咗一份。
    await expect(page.locator("header nav").first()).toBeHidden();
    await expect(page.locator(trigger)).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(drawer)).toBeHidden();

    // 單次手勢，唔重試：規格係「撳一下就開」。
    await page.locator(trigger).click();

    await expect(page.locator(drawer)).toBeVisible();
    await expect(page.locator(trigger)).toHaveAttribute("aria-expanded", "true");
    // `showModal()` 會 focus 入面第一個可 focus 元素。冇咗呢句，鍵盤用戶開完個
    // 抽屜之後 focus 會仲留喺背景。
    await expect(page.locator(closeButton)).toBeFocused();

    await page.keyboard.press("Escape");

    await expect(page.locator(drawer)).toBeHidden();
    await expect(page.locator(trigger)).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(trigger)).toBeFocused();
  });

  test("the drawer carries every desktop nav link plus the call to action", async ({ page }) => {
    const desktopLinks = await page.locator("header nav").first().locator("a").allTextContents();
    expect(desktopLinks.length).toBeGreaterThan(0);

    await page.locator(trigger).click();
    await expect(page.locator(drawer)).toBeVisible();

    const drawerLinks = await page.locator(`${drawer} nav a`).allTextContents();
    expect(drawerLinks).toEqual(desktopLinks);
    // CTA 喺 header 度 `sm:` 以下係收起嘅，所以抽屜一定要有佢，否則手機根本撳唔到。
    // 直屬嗰個 <a> 先係 CTA（抽屜尾仲有聯絡連結，`a.last()` 會揀錯）。
    await expect(page.locator(`${drawer} > div > a`)).toBeVisible();
  });

  test("growing past the desktop breakpoint closes the drawer instead of leaving the page inert", async ({ page }) => {
    await page.locator(trigger).click();
    await expect(page.locator(drawer)).toBeVisible();

    // 轉橫屏 / 拉大窗。個 dialog 有 `lg:hidden`，所以佢會即刻變 display:none —— 但
    // 如果佢仲係 `open`，背景就一路 inert，而關掣同漢堡掣兩個都睇唔到，成版撳唔到嘢。
    await page.setViewportSize({ width: 1280, height: 900 });

    await expect(page.locator(drawer)).not.toHaveAttribute("open", /.*/);
    await expect(page.locator("header nav").first()).toBeVisible();
    // 背景真係撳得返（唔係淨係「望落見到」）。
    await page.locator("header nav").first().locator("a").first().click();
  });

  test("an open drawer locks page scroll, and closing it hands scroll back at the same spot", async ({ page }) => {
    // native modal 只令背景 inert，唔會鎖捲動。
    await page.evaluate(() => window.scrollTo(0, 1500));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(1500);

    await page.locator(trigger).click();
    await expect(page.locator(drawer)).toBeVisible();
    await page.mouse.move(195, 700);
    await page.mouse.wheel(0, 800);
    // 等一陣先量：wheel 係非同步，即刻量會量到「未郁」而假綠。
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => window.scrollY)).toBe(1500);

    await page.keyboard.press("Escape");
    await expect(page.locator(drawer)).toBeHidden();
    expect(await page.evaluate(() => window.scrollY)).toBe(1500);
    // 鎖要真係解返，唔係留低一版碌唔郁嘅頁。
    await page.mouse.wheel(0, 400);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1500);
  });

  test("following a link closes the drawer, so it cannot cover the section you jumped to", async ({ page }) => {
    await page.locator(trigger).click();
    await expect(page.locator(drawer)).toBeVisible();

    await page.locator(`${drawer} nav a`).first().click();

    await expect(page.locator(drawer)).toBeHidden();
    await expect(page.locator(trigger)).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("the narrowest phones (320px)", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test("the header fits: no sideways scroll, logo not squashed, menu button fully on screen", async ({ page }) => {
    await page.goto("/pos?lang=en");
    await waitForHydration(page, page.locator(trigger));

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    // 頂欄塞爆唔一定會橫向捲動 —— flex 會靜靜將 logo 擠到得返幾 px 再俾隔籬遮住。
    const logo = await page.locator('header a[aria-label="ShopOps home"]').boundingBox();
    expect(logo?.width ?? 0).toBeGreaterThanOrEqual(28);

    const box = await page.locator(trigger).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(clientWidth);
    expect(box!.x).toBeGreaterThanOrEqual(logo!.x + logo!.width);

    await page.locator(trigger).click();
    await expect(page.locator(drawer)).toBeVisible();
    // 頂欄收起咗嘅聯絡連結要喺抽屜搵得返。
    await expect(page.locator(drawer).getByRole("link", { name: "Email ShopOps" })).toBeVisible();
  });
});

test.describe("wide screens", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("keep the full nav and drop the menu button entirely", async ({ page }) => {
    await page.goto("/pos?lang=en");

    await expect(page.locator("header nav").first()).toBeVisible();
    await expect(page.locator(trigger)).toBeHidden();
  });
});
