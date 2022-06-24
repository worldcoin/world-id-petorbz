import { App } from "aws-cdk-lib";

import { PetOrbz } from "./stack";

const app = new App();

new PetOrbz(app, app.node.tryGetContext("app"), {
  domainName: app.node.tryGetContext("domain_name"),
  env: {
    region: app.node.tryGetContext("region"),
    account: app.node.tryGetContext("account"),
  },
});

app.synth();
