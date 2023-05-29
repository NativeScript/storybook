# @nativescript/storybook

[Storybook](https://storybook.js.org/) for [NativeScript](https://nativescript.org/)

```bash
npm install @nativescript/storybook @valor/nativescript-websockets
```

Note: You can use any websocket polyfill however we preconfigure usage with `@valor/nativescript-websockets` for ease of use and should ensure it's added to your package.json dependencies.

## Usage

Using Storybook for NativeScript is easy as 1, 2, 3.

### 1. Init config

```bash
npx nativescript-storybook init
```

### 2. Create stories

You can create a `{component}.stories.ts|js` next to any component. Refer to storybook docs on writing stories:

- [Angular](https://storybook.js.org/docs/angular/writing-stories/introduction)
- [Vue](https://storybook.js.org/docs/vue/writing-stories/introduction)

### 3. Run Storybook

```bash
ns debug ios|android --env.storybook
```

## License

Apache License Version 2.0
