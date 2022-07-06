module.exports = {
    stories: ["../src/**/*.stories.ts"],
    addons: [
        // "@storybook/addon-docs",
        "@storybook/addon-controls",
        "@storybook/native-addon/dist/register.js"
    ],
    framework: "@storybook/angular",
    core: {
        builder: "webpack5"
    }
};
