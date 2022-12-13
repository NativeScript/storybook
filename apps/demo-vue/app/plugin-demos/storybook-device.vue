<template>
  <Page>
    <ActionBar>
      <Label text="storybook-device"/>
    </ActionBar>

    <GridLayout>
      <Button class="info" :text="message"/>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
  import Vue from "nativescript-vue";
  import { DemoSharedStorybookDevice } from '@demo/shared';
  import { } from '@nativescript/storybook-device';

  export default Vue.extend({
    computed: {
      message() {
        return "Test storybook-device";
      }
    }
  });
</script>

<style scoped lang="scss">

  .info {
    font-size: 20;
    horizontal-align: center;
    vertical-align: center;
  }
</style>
