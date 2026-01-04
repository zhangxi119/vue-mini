import { h, getCurrentInstance } from "../../lib/mini-vue.esm.js";

export const Foo = {
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    console.log("instance", instance);
  },

  render() {
    const foo = h("p", {}, `foo`);
    // console.log(this.$slots["header"](), "--------$slots");
    return h("div", {}, [
      // renderSlots(this.$slots, "header", { age: 66 }),
      foo,
      // renderSlots(this.$slots, "default"),
      // renderSlots(this.$slots, "footer"),
    ]);
  },
};
