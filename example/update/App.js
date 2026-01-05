import { h, ref } from "../../lib/mini-vue.esm.js";

// 创建App组件
window.self = null;
export const App = {
  setup() {
    const count = ref(0);

    const onClick = () => {
      count.value++;
      console.log("onClick---", count.value);
    };
    return {
      count,
      onClick,
    };
  },
  render() {
    window.self = this;
    return h(
      "button",
      {
        id: "root",
        class: ["red"],
      },
      [
        h("div", {}, `count: ${this.count}`),
        h("button", { onClick: this.onClick }, "click"),
      ]
    );
  },
};
