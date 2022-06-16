import { APIGatewayEvent } from "aws-lambda";

export const svgTransformation = (event: APIGatewayEvent) => {
  if (event.body) {
    console.log(JSON.parse(event.body).param);
  }
};
