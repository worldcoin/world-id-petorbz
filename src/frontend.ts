import { execSync } from "node:child_process";
import {
  DockerImage,
  NestedStack,
  RemovalPolicy,
  Stack,
  type BundlingOptions,
  type ILocalBundling,
  type NestedStackProps,
} from "aws-cdk-lib";
// import {
//   CertificateValidation,
//   DnsValidatedCertificate,
// } from "aws-cdk-lib/aws-certificatemanager";
// import {
//   AllowedMethods,
//   Distribution,
//   PriceClass,
//   ViewerProtocolPolicy,
// } from "aws-cdk-lib/aws-cloudfront";
// import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import {
  //   ARecord,
  //   RecordTarget,
  type IHostedZone,
} from "aws-cdk-lib/aws-route53";
// import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import {
  // BlockPublicAccess,
  Bucket,
} from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

class CraBundle implements ILocalBundling {
  public tryBundle(outputDir: string, options: BundlingOptions) {
    const command =
      process.env.NODE_ENV !== "test"
        ? options.command![0]
        : "echo Mock bundling > $BUILD_PATH/mock.txt";

    // building the frontend
    console.time("Frontend build time");
    execSync(command, {
      cwd: options.workingDirectory,
      stdio: ["ignore", "ignore", "inherit"],
      encoding: "utf-8",
      env: {
        /**  @see {@link https://create-react-app.dev/docs/advanced-configuration/} */
        CI: "true",
        DISABLE_ESLINT_PLUGIN: "true",
        FORCE_COLOR: "2",
        BUILD_PATH: outputDir,
        ...process.env,
        ...(options.environment ?? {}),
      },
    });
    console.timeEnd("Frontend build time");

    return true;
  }
}

export class FrontEndStack extends NestedStack {
  readonly websiteUrl: string;

  constructor(
    scope: Construct,
    id: string,
    props: NestedStackProps & {
      frontendPath: string;
      environment: Record<string, string>;
      hostedZone?: IHostedZone;
    }
  ) {
    super(scope, id, props);

    const { stackName } = Stack.of(scope);
    // const { hostedZone } = props;

    // const certificate = new DnsValidatedCertificate(
    //   scope,
    //   `${stackName}Certificate`,
    //   {
    //     domainName: hostedZone.zoneName,
    //     hostedZone,
    //     region: "us-east-1", // Cloudfront only checks this region for certificates.
    //     cleanupRoute53Records: true,
    //   }
    // );

    // Create S3 Bucket for our website static assets
    const siteBucket = new Bucket(this, `${stackName}FrontendBucket`, {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      // FIXME remove when hosted zone will be set
      //   blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
    });
    this.websiteUrl = siteBucket.bucketWebsiteUrl;

    // const distribution = new Distribution(this, `${stackName}Distribution`, {
    //   defaultBehavior: {
    //     origin: new S3Origin(siteBucket),
    //     compress: true,
    //     allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
    //     viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    //   },
    //   certificate,
    //   defaultRootObject: "/index.html",
    //   domainNames: [hostedZone.zoneName],
    //   enableLogging: true,
    //   logIncludesCookies: true,
    //   priceClass: PriceClass.PRICE_CLASS_ALL,
    //   errorResponses: [
    //     {
    //       httpStatus: 403,
    //       responseHttpStatus: 200,
    //       responsePagePath: "/index.html",
    //     },
    //     {
    //       httpStatus: 404,
    //       responseHttpStatus: 200,
    //       responsePagePath: "/index.html",
    //     },
    //   ],
    // });

    // new ARecord(this, `${stackName}StageDomainAlias`, {
    //   zone: hostedZone,
    //   target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    // });

    //Deploy site to s3
    const deploymentSource = Source.asset(props.frontendPath, {
      bundling: {
        local: new CraBundle(),
        image: DockerImage.fromRegistry("node:16"),
        environment: props.environment,
        workingDirectory: props.frontendPath,
        command: ["npm run-script --silent compile"],
      },
    });

    new BucketDeployment(this, "Deployment", {
      sources: [deploymentSource],
      destinationBucket: siteBucket,
      //   distribution,
      //   distributionPaths: ["/*"],
    });
  }
}
