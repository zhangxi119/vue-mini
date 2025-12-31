import { h, getCurrentInstance } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

// 创建App组件
export const App = {
  render() {
    const app = h("p", {}, "App");
    const foo = h(Foo);
    return h("div", {}, [app, foo]);
  },

  setup() {
    const instance = getCurrentInstance();
    console.log(instance);
    return {
      msg: "mini-vue666",
    };
  },
};
