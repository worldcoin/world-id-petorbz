import path from "path";
import { awscdk, javascript } from "projen";
import { ReactTypeScriptProject, TailwindConfig } from "projen/lib/web";

const project = new awscdk.AwsCdkTypeScriptApp({
  context: { app: "petorbz" },
  appEntrypoint: "index.ts",
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
  mergify: false,
  devDeps: ["cdk-nag@2.14.35"],
  prettier: true,
  srcdir: "src",
  testdir: "src",
});

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
new TailwindConfig(landingPageProject);
landingPageProject.addDeps("classnames");
landingPageProject.addDevDeps("tailwindcss", "prettier-plugin-tailwindcss");

landingPageProject.synth();
const landingPageDir = path.relative(project.outdir, landingPageProject.outdir);
for (const tsconfig of [project.tsconfig, project.tsconfigDev]) {
  tsconfig?.addExclude(landingPageDir);
}

project.synth();
