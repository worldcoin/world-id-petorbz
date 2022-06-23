import * as cdk from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { SvgTransformation } from "./svg-transformation";

export class Petorbz extends Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    new SvgTransformation(this, "svg-transformation", {});
  }
}
