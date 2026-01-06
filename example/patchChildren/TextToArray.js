import { h, ref } from "../../lib/mini-vue.esm.js";

const prevChildren = "oldChildren";
const nextChildren = [h("div", {}, "A"), h("div", {}, "B")];

export const TextToArray = {
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
