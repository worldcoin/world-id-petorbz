import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class SvgTransformation extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "svg-transformation",
      {
        entry: "src/svg-transformation/functions/svg-transformation.ts",
        handler: "svgTransformation",
        runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
      }
    );

    this.exportValue(lambda.functionName, {
      name: "svg-transformation-function-name",
    });
  }
}
