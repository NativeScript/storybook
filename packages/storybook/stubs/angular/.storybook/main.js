const { AngularFramework } = require("@nativescript/storybook");

module.exports = {
  stories: ["../src/**/*.stories.ts"],
  addons: [
    "@storybook/addon-controls",
    "@nativescript/storybook",
    // ...
  ],
  core: {
    builder: "webpack5",
  },
  framework: AngularFramework,
};
