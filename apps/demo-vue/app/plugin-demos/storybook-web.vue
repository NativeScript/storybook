<template>
  <Page>
    <ActionBar>
      <Label text="storybook-web"/>
    </ActionBar>

    <GridLayout>
      <Button class="info" :text="message"/>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
  import Vue from "nativescript-vue";
  import { DemoSharedStorybookWeb } from '@demo/shared';
  import { } from '@nativescript/storybook-web';

  export default Vue.extend({
    computed: {
      message() {
        return "Test storybook-web";
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
