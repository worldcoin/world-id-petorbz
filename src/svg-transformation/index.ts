import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { MultiEnvStack } from "../common/multi-env-stack";

export class SvgTransformation extends MultiEnvStack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "svg-transformation",
      {
        entry: "src/svg-transformation/functions/svg-transformation/index.ts",
        handler: "svgTransformation",
        runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
      }
    );

    const functionUrl = lambda.addFunctionUrl({
      authType: cdk.aws_lambda.FunctionUrlAuthType.NONE,
    });

    new cdk.CfnOutput(this, "svg-transformation-function-url", {
      value: functionUrl.url,
    });
  }
}
