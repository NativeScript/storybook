<template>
  <Button :class="classes" @tap="onClick" :style="style" :text="label || 'No label'" />
</template>

<script>
import { Utils } from "@nativescript/core"
export default {
  name: "my-button",

  props: {
    label: {
      type: String,
      required: true,
    },
    primary: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "medium",
      validator: function (value) {
        return ["small", "medium", "large"].indexOf(value) !== -1;
      },
    },
    backgroundColor: {
      type: String,
    },
  },

  computed: {
    classes() {
      return {
        "storybook-button": true,
        "storybook-button--primary": this.primary,
        "storybook-button--secondary": !this.primary,
        [`storybook-button--${this.size}`]: true,
      };
    },
    style() {
      return {
        backgroundColor: this.backgroundColor,
      };
    },
  },

  methods: {
    onClick() {
      console.log(Utils.SDK_VERSION);
      this.$emit("onClick");
    },
  },
};
</script>

<style scoped>
.storybook-button {
  border-radius: 12;
  background-color: #eee;
  padding: 8;
}

.storybook-button--primary {
  color: blue;
}

.storybook-button--secondary {
  color: red;
}

.storybook-button--small {
  font-size: 14;
}

.storybook-button--medium {
  font-size: 24;
}

.storybook-button--large {
  font-size: 36;
}
</style>
