import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { svgTemplate } from "./svg-template";

export const svgTransformation = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const name = JSON.parse(event?.body || "").name;

  if (!name) {
    return { statusCode: 500, body: '"name" is missing' };
  }

  return {
    statusCode: 200,
    body: svgTemplate({ name }),
  };
};
