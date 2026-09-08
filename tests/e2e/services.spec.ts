import { test, expect } from "@playwright/test";
import { samplePdf } from "../fixtures/document";

test("PDF extraction remains a draft; image OCR is explicitly unavailable", async ({
  request,
}) => {
  const pdf = await request.post("/api/documents/upload", {
    multipart: {
      file: {
        name: "synthetic.pdf",
        mimeType: "application/pdf",
        buffer: samplePdf(),
      },
    },
  });
  expect(pdf.status()).toBe(200);
  const data = await pdf.json();
  expect(data.extractedText).toContain("35 AUD");
  expect(data.confirmationRequired).toBe(true);
  expect(data.analysisAvailable).toBe(false);
  const image = await request.post("/api/documents/upload", {
    multipart: {
      file: {
        name: "test.png",
        mimeType: "image/png",
        buffer: Buffer.from("synthetic"),
      },
    },
  });
  expect((await image.json()).status).toBe("IMAGE_OCR_NOT_CONFIGURED");
});

test("unavailable analysis preserves input and does not fabricate a report", async ({
  page,
}) => {
  await page.route("**/api/chat", (route) =>
    route.fulfill({ status: 503, json: { error: "CHAT_UNAVAILABLE" } }),
  );
  await page.goto("/diagnostic/analyze");
  await page.getByLabel("描述发生的事情").fill("工资单还没有收到");
  await page.getByRole("button", { name: "发送并分析" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "输入已保留",
  );
  await expect(page.getByLabel("描述发生的事情")).toHaveValue(
    "工资单还没有收到",
  );
  await expect(page.locator(".message.assistant")).toHaveCount(0);
});

test("age can be typed sequentially and invalid values become unknown", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("年龄", { exact: true }).pressSequentially("25");
  await page.getByLabel("年龄", { exact: true }).blur();
  await expect(page.getByLabel("年龄", { exact: true })).toHaveValue("25");
  await page.getByLabel("年龄", { exact: true }).fill("5");
  await page.getByLabel("年龄", { exact: true }).blur();
  await expect(page.getByLabel("年龄", { exact: true })).toHaveValue("");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "已清空",
  );
});
