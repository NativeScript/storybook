<template>
  <Page>
    <ActionBar>
      <Label text="storybook-generator"/>
    </ActionBar>

    <GridLayout>
      <Button class="info" :text="message"/>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
  import Vue from "nativescript-vue";
  import { DemoSharedStorybookGenerator } from '@demo/shared';
  import { } from '@nativescript/storybook-generator';

  export default Vue.extend({
    computed: {
      message() {
        return "Test storybook-generator";
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
