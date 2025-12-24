import { h } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

// 创建App组件
window.self = null;
export const App = {
  render() {
    window.self = this;
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
        onClick() {
          console.log("click");
        },
        onMousedown() {
          console.log("onMousedown");
        },
      },
      [h("div", {}, `hi, ${this.msg}`), h(Foo, { count: 666 })]
      // string
      // "hi, " + this.msg

      // array
      // [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "vue")]
    );
  },

  setup() {
    return {
      msg: "mini-vue666",
    };
  },
};
