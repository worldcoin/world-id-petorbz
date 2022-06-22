import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class MultiEnvStack extends cdk.Stack {
  public readonly id: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.id = id;
  }

  // Prefix the stack name with the developer's environment id
  public get stackName(): string {
    return (
      this.node.tryGetContext("env").stage === "dev"
        ? [this.node.tryGetContext("env:id")]
        : []
    )
      .concat(this.node.scopes.map((scope) => scope.node.id).filter(Boolean))
      .join("-");
  }
}
