import path from "path";
import { awscdk, javascript } from "projen";
import { ReactTypeScriptProject } from "projen/lib/web";

const project = new awscdk.AwsCdkTypeScriptApp({
  context: {
    app: "petorbz",
    "@aws-cdk/core:bootstrapQualifier": "worldid",
    zone_name: "dev.petorbz.com",
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
  defaultReleaseBranch: "main",
  cdkVersion: "2.27.0",
  constructsVersion: "10.1.39",
  jest: false,
  github: false,
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
  defaultReleaseBranch: "main",
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

project.synth();
