import chromium from "@sparticuz/chrome-aws-lambda";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import playwright from "playwright-core";
import { svgTemplate } from "./svg-template";

export const svgTransformation = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  let name;
  const dimensions = { height: 1024, width: 1024 };

  try {
    // REVIEW It's probably too naive to use the path for the value of the name
    name = decodeURI(event.rawPath.split("/")[1]);
  } catch {
    return { statusCode: 400, body: "Bad Request" };
  }

  const browser = await playwright.chromium.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage({
    screen: dimensions,
    viewport: dimensions,
  });

  await page.setContent(svgTemplate({ name }));
  const screenshot = (await page.screenshot()).toString("base64");
  await browser.close();

  return {
    headers: { "Content-Type": "image/png" },
    isBase64Encoded: true,
    statusCode: 200,
    body: screenshot,
  };
};
