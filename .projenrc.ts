import path from "path";
import { awscdk, javascript, SampleFile } from "projen";
import { ReactTypeScriptProject } from "projen/lib/web";

const project = new awscdk.AwsCdkTypeScriptApp({
  context: { app: "petorbz", "@aws-cdk/core:bootstrapQualifier": "worldid" },
  appEntrypoint: "index.ts",
  name: "petzobz-backend",
  license: "MIT",
  copyrightOwner: "Humanity Corporation",
  packageManager: javascript.NodePackageManager.NPM,
  projenrcTs: true,
  defaultReleaseBranch: "main",
  cdkVersion: "2.29.0",
  constructsVersion: "10.1.42",
  jest: false,
  github: false,
  gitignore: [".DS_Store"],
  mergify: false,
  deps: ["@sparticuz/chrome-aws-lambda"],
  devDeps: ["@types/aws-lambda"],
  prettier: true,
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

landingPageProject.addDeps(
  "classnames",
  "@rainbow-me/rainbowkit",
  "wagmi",
  "ethers",
  "buffer",
  "@worldcoin/id"
);

landingPageProject.addDevDeps(
  "tailwindcss",
  "postcss",
  "autoprefixer",
  "prettier-plugin-tailwindcss",
  "react-app-rewired"
);
landingPageProject.setScript(
  "start",
  "react-app-rewired start --scripts-version react-scripts"
);
landingPageProject.setScript(
  "build",
  "react-app-rewired build --scripts-version react-scripts"
);
landingPageProject.setScript(
  "test",
  "react-app-rewired test --env=jsdom --scripts-version react-scripts"
);
new SampleFile(landingPageProject, "config-overrides.js", {
  contents: `
  const webpack = require("webpack");
  module.exports = function override(config, env) {
    if (!config.plugins) {
      config.plugins = [];
    }
  
    config.plugins.push(
      new webpack.ProvidePlugin({ Buffer: ["buffer", "Buffer"] })
    );
  
    return config;
  };
`,
});

landingPageProject.synth();
const landingPageDir = path.relative(project.outdir, landingPageProject.outdir);
for (const tsconfig of [project.tsconfig, project.tsconfigDev]) {
  tsconfig?.addExclude(landingPageDir);
}

project.synth();
