import { h, createTextVNode } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

// 创建App组件
export const App = {
  render() {
    const app = h("div", {}, "App");
    // const foo = h(Foo, {}, [h("p", {}, "123"), h("p", {}, "456")]);
    const foo = h(
      Foo,
      {},
      {
        default: () => [h("p", {}, "123"), h("p", {}, "456")],
        header: ({ age }) => h("p", {}, "header" + age),
        footer: () => [
          h("span", {}, "footer-"),
          createTextVNode("footerText..."),
        ],
      }
    );

    return h("div", {}, [app, foo]);
  },

  setup() {
    return {
      msg: "mini-vue666",
    };
  },
};
