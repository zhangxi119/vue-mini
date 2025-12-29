import { h, renderSlots } from "../../lib/mini-vue.esm.js";

export const Foo = {
  setup(props, { emit }) {},

  render() {
    const foo = h("p", {}, `foo`);
    // console.log(this.$slots["header"](), "--------$slots");
    return h("div", {}, [
      renderSlots(this.$slots, "header", { age: 66 }),
      foo,
      renderSlots(this.$slots, "default"),
      renderSlots(this.$slots, "footer"),
    ]);
  },
};
