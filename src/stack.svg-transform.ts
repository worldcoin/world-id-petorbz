import chromium from "@sparticuz/chrome-aws-lambda";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

import berlingskeFont from "./assets/fonts/berlingske-serif-bold.otf";
import htmlTemplate from "./assets/page-template.html";

const pageTemplate = htmlTemplate
  .replaceAll("{{FONT_NAME}}", "BerlingskeSerif-Bold")
  .replaceAll("{{FONT_TYPE}}", "opentype")
  .replaceAll("{{FONT_DATA_URL}}", berlingskeFont);

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  let browser;
  try {
    const input = JSON.parse(event.body ?? "") as {
      name: string;
      svgTemplate: string;
    };

    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    const svgContent = input.svgTemplate.replaceAll("{NAME HERE}", input.name);

    await page.setContent(pageTemplate.replace("{{SVG_CONTENT}}", svgContent), {
      waitUntil: "networkidle0",
      timeout: context.getRemainingTimeInMillis() - 1000,
    });

    const screenshot = (await page.screenshot({
      fullPage: true,
      omitBackground: true,
      encoding: "base64",
    })) as string;

    return {
      headers: { "Content-Type": "image/png" },
      isBase64Encoded: true,
      statusCode: 200,
      body: screenshot,
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 400, body: "Bad Request" };
  } finally {
    await browser?.close();
  }
};
