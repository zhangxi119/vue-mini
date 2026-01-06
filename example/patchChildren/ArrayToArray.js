import { h, ref } from "../../lib/mini-vue.esm.js";

// 双端对比算法测试用例

// 1.左侧的对比
// const prevChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C")
// ];
// const nextChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "D" }, "D"),
//   h("div", { key: "E" }, "E")
// ];

// 2.右侧的对比
// const prevChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C")
// ];
// const nextChildren = [
//   h("div", { key: "D" }, "D"),
//   h("div", { key: "E" }, "E"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
// ];

// 3.新的比老的多
// - 左侧的对比
// const prevChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
// ];
// const nextChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
//   h("div", { key: "D" }, "D")
// ];
// - 右侧的对比
// const prevChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
// ];
// const nextChildren = [
//   h("div", { key: "C" }, "C"),
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
// ];

// 3.新的比老的少
// - 左侧的对比
// const prevChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
//   h("div", { key: "D" }, "D")
// ];
// const nextChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
// ];
// - 右侧的对比
const prevChildren = [
  h("div", { key: "A" }, "A"),
  h("div", { key: "B" }, "B"),
  h("div", { key: "C" }, "C"),
  h("div", { key: "D" }, "D")
];
const nextChildren = [
  h("div", { key: "C" }, "C"),
  h("div", { key: "D" }, "D")
];

export const ArrayToArray = {
  setup(props) {
    const isChange = ref(false);
    window.isChange = isChange;

    return {
      isChange,
    }
  },

  render() {
    const self = this;
    return self.isChange === true ? h("div", {}, nextChildren) : h("div", {}, prevChildren)
  },
};
