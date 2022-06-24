import path from "path";
import { awscdk, javascript } from "projen";
import { GithubCredentials } from "projen/lib/github";
import { JobPermission } from "projen/lib/github/workflows-model";
import { ReactTypeScriptProject } from "projen/lib/web";

const defaultReleaseBranch = "main";

const project = new awscdk.AwsCdkTypeScriptApp({
  context: {
    app: "petorbz",
    "@aws-cdk/core:bootstrapQualifier": "worldid",
    infura_id: "7a5d08b9ebe14d6690adebed05e77e83",
    petorbz_address: "0x9230211f4678365beca1c243b336843ff62751fd",
    wld_signal: "wid_d431510b467e07999228ccf880d80ad2",
  },
  appEntrypoint: "app.ts",
  name: "petzobz-backend",
  license: "MIT",
  copyrightOwner: "Humanity Corporation",
  packageManager: javascript.NodePackageManager.NPM,
  projenrcTs: true,
  defaultReleaseBranch,
  cdkVersion: "2.27.0",
  constructsVersion: "10.1.39",
  jest: false,
  github: true,
  depsUpgrade: false,
  githubOptions: {
    pullRequestLint: false,
    projenCredentials: GithubCredentials.fromPersonalAccessToken({
      secret: "GITHUB_TOKEN",
    }),
  },
  gitignore: [".DS_Store"],
  mergify: false,
  deps: ["@sparticuz/chrome-aws-lambda"],
  devDeps: ["@types/aws-lambda"],
  prettier: true,
  srcdir: "src",
  testdir: "src",
});

project.tsconfig?.file.addOverride("compilerOptions.target", "es2021");
project.tsconfigDev?.file.addOverride("compilerOptions.target", "es2021");
project.tsconfig?.compilerOptions.lib?.push("es2021");
project.tsconfigDev?.compilerOptions.lib?.push("es2021");

const landingPageProject = new ReactTypeScriptProject({
  parent: project,
  name: "Landing page frontend",
  packageName: "landing-page",
  defaultReleaseBranch,
  packageManager: javascript.NodePackageManager.NPM,
  github: false,
  outdir: path.join(project.srcdir, "landing-page"),
  typescriptVersion: "^4.7",
  licensed: false,
  depsUpgrade: false,
  readme: { filename: ".gitignore" /* prevent creating README.md */ },
});
landingPageProject
  .tryFindObjectFile("package.json")
  ?.addOverride("eslintConfig.root", true);

landingPageProject.addDeps(
  "classnames",
  "@rainbow-me/rainbowkit",
  "wagmi",
  "ethers",
  "@worldcoin/id",
  "buffer"
);

landingPageProject.addDevDeps(
  "tailwindcss",
  "postcss",
  "autoprefixer",
  "prettier-plugin-tailwindcss"
);

landingPageProject.synth();
const landingPageDir = path.relative(project.outdir, landingPageProject.outdir);
for (const tsconfig of [project.tsconfig, project.tsconfigDev]) {
  tsconfig?.addExclude(landingPageDir);
}

//#region Adding deployment workflow for Github
const deploymentWorkflow = project.github?.addWorkflow("deploy");
deploymentWorkflow?.on({
  push: { branches: [defaultReleaseBranch] },
  workflowDispatch: {},
  pullRequest: {
    // @ts-expect-errors
    paths: [".github/workflows/deploy.yml"],
  },
});
deploymentWorkflow?.addJob("production", {
  runsOn: ["ubuntu-latest"],
  permissions: {
    deployments: JobPermission.WRITE,
    contents: JobPermission.READ,
    idToken: JobPermission.WRITE,
  },
  environment: "production",
  concurrency: {
    group: "production_deploy",
    "cancel-in-progress": false, // killing CFN deployments maybe a bad idea
  },
  steps: [
    {
      name: "Checkout",
      uses: "actions/checkout@v3",
    },
    {
      name: "Setup Node.js",
      uses: "actions/setup-node@v3",
      with: {
        "node-version": 16,
        cache: "npm",
      },
    },
    {
      name: "Install dependencies",
      run: "npm ci",
    },
    {
      name: "Synth project",
      run: "npx projen",
      env: {
        NPM_CONFIG_LOGLEVEL: "error",
        NPM_CONFIG_FUND: "0",
        NPM_CONFIG_AUDIT: "0",
      },
    },
    {
      name: "Authenticate via OIDC role",
      uses: "aws-actions/configure-aws-credentials@v1",
      with: {
        "role-to-assume":
          "arn:aws:iam::033662022620:role/oidc/cdk-cicd-worldid-prod",
        "role-duration-seconds": 1800,
        "aws-region": "us-east-1",
        "mask-aws-account-id": false,
        "role-skip-session-tagging": true,
      },
    },
    {
      name: "Deploy via CDK",
      run: "npx cdk deploy --v --all --require-approval never --outputs-file ./cdk-outputs.json --context account=906266994114 --context region=us-east-1 --context domain_name=petorbz.com",
    },
  ],
});

//#endregion deployment

project.synth();
