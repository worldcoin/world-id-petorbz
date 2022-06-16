import assert from "assert";
import * as cdk from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { Construct } from "constructs";
import { MultiEnvStack } from "./common/multi-env-stack";
import { SvgTransformation } from "./svg-transformation";

export class Petorbz extends MultiEnvStack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    cdk.Tags.of(this).add("app", this.node.tryGetContext("app"));

    // ANCHOR Checks
    // Run best practices and shallow security checks
    if (!this.node.tryGetContext("isCDKNagDisabled")) {
      cdk.Aspects.of(this).add(new AwsSolutionsChecks());
    }

    assert(
      this.node.tryGetContext("env").stage !== "dev" ||
        this.node.tryGetContext("env:id"),
      'Dev stacks must always be prefixed, pass "--context env:id=<your env name>"'
    );

    // ANCHOR Define stacks
    new SvgTransformation(this, "svg-transformation", {});
  }
}

// Without "treeMetadata: false" setContext() call within the App is not allowed
const app = new cdk.App({
  context: {
    ...{
      dev: {
        env: { account: "926986201233", stage: "dev", region: "us-east-1" },
      },
    }[process.env.PETORBZ_STAGE || "dev"],
  },
});

new Petorbz(app, "petorbz", {});
app.synth();
