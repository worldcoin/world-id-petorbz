import { execSync } from "node:child_process";

import {
  DockerImage,
  Duration,
  Fn,
  RemovalPolicy,
  Stack,
  type BundlingOptions,
  type ILocalBundling,
} from "aws-cdk-lib";
import {
  Certificate,
  CertificateValidation,
  ICertificate,
} from "aws-cdk-lib/aws-certificatemanager";
import {
  AllowedMethods,
  Distribution,
  ViewerProtocolPolicy,
  OriginAccessIdentity,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import {
  ARecord,
  RecordTarget,
  type IHostedZone,
} from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import {
  BucketDeployment,
  CacheControl,
  Source,
} from "aws-cdk-lib/aws-s3-deployment";
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

export class StaticWebsite extends Construct {
  readonly websiteUrl: string;

  constructor(
    scope: Construct,
    id: string,
    props: {
      frontendPath: string;
      environment: Record<string, string>;
      hostedZone?: IHostedZone;
    }
  ) {
    super(scope, id);

    const { stackName } = Stack.of(scope);
    const { hostedZone } = props;

    let certificate: ICertificate | undefined;
    let domainNames: string[] | undefined;
    if (hostedZone) {
      certificate = new Certificate(
        this,
        `${stackName}-"CertificateManagerCertificate`,
        {
          domainName: hostedZone.zoneName,
          validation: CertificateValidation.fromDns(hostedZone),
        }
      );
      domainNames = [hostedZone.zoneName];
    }

    // Create S3 Bucket for our website static assets
    const siteBucket = new Bucket(this, `${stackName}-WebsiteBucket`, {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );
    siteBucket.grantRead(originAccessIdentity);

    const distribution = new Distribution(this, `${stackName}-Distribution`, {
      defaultBehavior: {
        origin: new S3Origin(siteBucket, { originAccessIdentity }),
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      certificate,
      domainNames,
      defaultRootObject: "/index.html",
      enableLogging: true,
      logIncludesCookies: true,
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    });
    this.websiteUrl = Fn.join("//", [
      "https:",
      hostedZone ? hostedZone.zoneName : distribution.distributionDomainName,
    ]);

    if (hostedZone) {
      new ARecord(this, `${stackName}DomainAlias`, {
        zone: hostedZone,
        target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      });
    }

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
      distribution,
      distributionPaths: ["/*"],
      cacheControl: [
        CacheControl.maxAge(Duration.days(1)),
        CacheControl.setPublic(),
      ],
      logRetention: RetentionDays.ONE_WEEK,
    });
  }
}
