import { test, expect } from "@playwright/test";
test("case can be saved, restored, checked and switched to English", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByLabel("在此设备保存案例").check();
  await page.getByLabel("案例名称").fill("Cafe trial");
  await page.getByLabel("税前时薪（澳元）", { exact: true }).fill("20");
  await page.getByRole("button", { name: "检查当前信息" }).click();
  await expect(
    page.getByRole("heading", { name: "先补充信息与核验" }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("案例名称")).toHaveValue("Cafe trial");
  await expect(
    page.getByLabel("税前时薪（澳元）", { exact: true }),
  ).toHaveValue("20");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(
    page.getByRole("button", { name: "Job details", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Evidence", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Evidence and fact confirmation" }),
  ).toBeVisible();
  await page.getByLabel("Evidence name", { exact: true }).fill("Offer message");
  await page
    .getByLabel("Confirmed text or excerpt")
    .fill("Gross pay is $35 per hour.");
  await page
    .getByLabel("Confirmed gross hourly rate in the text (optional)")
    .fill("35");
  await page.getByRole("button", { name: "Confirm and add to case" }).click();
  await page.getByRole("button", { name: "Job details", exact: true }).click();
  await expect(
    page.getByLabel("Hourly pay before tax (AUD)", { exact: true }),
  ).toHaveValue("35");
  await page.getByRole("button", { name: "Hours", exact: true }).click();
  await page.getByLabel("Date", { exact: true }).fill("2026-09-07");
  await page.getByLabel("Hours worked (excluding breaks)").fill("8");
  await page.getByRole("button", { name: "Add shift" }).click();
  await expect(page.locator("table tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "Actions", exact: true }).click();
  await page.getByLabel("Keep all shift and roster records").check();
  await page.getByRole("button", { name: "Compare", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "$35.00", exact: true }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath("workspace.png"),
    fullPage: true,
  });
});
test("registry candidate does not promote independent identity status", async ({
  page,
}) => {
  await page.route("**/api/verification/abn", async (route) =>
    route.fulfill({
      json: {
        status: "record_found",
        matches: [{ name: "Example", abn: "51824753556", status: "Cancelled" }],
      },
    }),
  );
  await page.goto("/");
  await page.getByLabel("雇主名称或 ABN", { exact: true }).fill("Example");
  await page.getByRole("button", { name: "查询注册记录", exact: true }).click();
  await expect(
    page.getByText("找到候选注册记录", { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("独立身份核验", { exact: true })).toHaveValue(
    "unknown",
  );
  await page.getByLabel("雇主名称或 ABN", { exact: true }).fill("Different");
  await expect(page.getByText("找到候选注册记录", { exact: true })).toHaveCount(
    0,
  );
});
