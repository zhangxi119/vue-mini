import { h } from "../../lib/mini-vue.esm.js";
import { ArrayToText } from "./ArrayToText.js";
import { TextToText } from "./TextToText.js";
import { TextToArray } from "./TextToArray.js";

// 创建App组件
window.self = null;
export const App = {
  name: "App",
  setup() {},
  render() {;
    return h("div", {}, [
      h("div", {}, "App"),
      // h(ArrayToText),
      // h(TextToText),
      h(TextToArray),
    ]);
  },
};
