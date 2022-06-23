import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import {
  FunctionUrlAuthType,
  LambdaInsightsVersion,
  LayerVersion,
  Runtime,
  Tracing,
} from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class PetOrbz extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambda = new NodejsFunction(this, "svg-transform", {
      bundling: {
        target: "node16.14",
        externalModules: ["@sparticuz/chrome-aws-lambda", "aws-sdk"],
        sourceMap: true,
        sourcesContent: false,
        loader: {
          ".otf": "dataurl",
          ".html": "text",
        },
      },

      layers: [
        LayerVersion.fromLayerVersionArn(
          this,
          "ChromeBinary",
          "arn:aws:lambda:us-east-1:764866452798:layer:chrome-aws-lambda:31"
        ),
      ],

      memorySize: 2048,
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.minutes(2),
      environment: {
        NODE_MODULE: "--enable-source-maps",
      },
      insightsVersion: LambdaInsightsVersion.VERSION_1_0_135_0,
      tracing: Tracing.ACTIVE,
    });

    const functionUrl = lambda.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, "svg-transformation-function-url", {
      value: functionUrl.url,
    });
  }
}
