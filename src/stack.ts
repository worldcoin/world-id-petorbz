import path from "path";
import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import {
  FunctionUrlAuthType,
  LambdaInsightsVersion,
  LayerVersion,
  Runtime,
  Tracing,
} from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { HostedZone, IHostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
import { StaticWebsite } from "./frontend";

export class PetOrbz extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    let hostedZone: IHostedZone | undefined;
    const domainName = this.node.tryGetContext("domain_name");
    if (domainName) {
      hostedZone = HostedZone.fromLookup(this, "HostedZoneId", {
        domainName,
      });
    }

    //#region Front-end resources
    const frontend = new StaticWebsite(this, `${this.stackName}-frontend`, {
      hostedZone,
      frontendPath: path.resolve(__dirname, "./landing-page"),
      environment: {
        REACT_APP_INFURA_ID: this.node.tryGetContext("infura_id"),
        REACT_APP_PETORBZ_ADDRESS: this.node.tryGetContext("petorbz_address"),
        REACT_APP_WLD_SIGNAL: this.node.tryGetContext("wld_signal"),
      },
    });
    new CfnOutput(this, "FrontEndWebsiteUrl", {
      value: frontend.websiteUrl,
    });
    //#endregion Front-end

    //#region Backend resources
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
      timeout: Duration.minutes(1),
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
    //#endregion Backend resources
  }
}
