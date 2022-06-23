import { App } from "aws-cdk-lib";

import { PetOrbz } from "./stack";

const app = new App();

new PetOrbz(app, app.node.tryGetContext("app"));

app.synth();
