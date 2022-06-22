import chromium from "@sparticuz/chrome-aws-lambda";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import playwright from "playwright-core";
import { svgTemplate } from "./svg-template";
import { svg } from "./types/svg";

export const svgTransformation = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  let input: { name: string; svgTemplate: svg };

  try {
    input = JSON.parse(event.body || "");
  } catch {
    return { statusCode: 400, body: "Bad Request" };
  }

  const browser = await playwright.chromium.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.setContent(
    svgTemplate({ name: input.name, svg: input.svgTemplate })
  );

  await page.waitForLoadState("networkidle");

  const screenshot = (await page.screenshot({ fullPage: true })).toString(
    "base64"
  );
  await browser.close();

  return {
    headers: { "Content-Type": "image/png" },
    isBase64Encoded: true,
    statusCode: 200,
    body: screenshot,
  };
};
