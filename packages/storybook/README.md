# @nativescript/storybook

[Storybook](https://storybook.js.org/) for [NativeScript](https://nativescript.org/)

```bash
npm install @nativescript/storybook@beta @valor/nativescript-websockets
```

*Note*: You can use any WebSocket polyfill however we preconfigure usage with `@valor/nativescript-websockets` for ease of use and should ensure it's added to your package.json dependencies.

## Usage

Using Storybook for NativeScript is easy as 1, 2, 3.

### 1. Init config

```bash
npx @nativescript/storybook init
```

### 2. Create stories

You can create a `{component}.stories.ts|js` next to any component. Refer to storybook docs on writing stories:

- [Angular](https://storybook.js.org/docs/angular/writing-stories/introduction)
- [Vue](https://storybook.js.org/docs/vue/writing-stories/introduction)

### 3. Run Storybook

Launch Storybook:

```bash
npm run storybook

# or
npm run storybook android
npm run storybook ios
```

Once your app is booted, you can select a story in the Storybook web manager.

#### Note: Android Network Config

Ensure Android is configured to use `cleartextTrafficPermitted` option. The following will describe how you can setup debug/release configurations to make this setting remain secure upon any Android release.

1. Add the following to your `App_Resources/Android/app.gradle`:

```ts
android {
  // ...

  defaultConfig {
    // ...
  }

  buildTypes {
    debug {
      resValue "string", "clear_text_config", "true"
    }
    release {
      resValue "string", "clear_text_config", "false"
    }
  }
}
```

2. Create `App_Resources/Android/src/main/res/xml/network_config.xml` with the following:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="@string/clear_text_config">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
```

3. Update `App_Resources/Android/src/main/AndroidManifest.xml` to use it:
   
```xml
<application
    android:networkSecurityConfig="@xml/network_config"
    ...
    >

</application>
```

## License

Apache License Version 2.0
