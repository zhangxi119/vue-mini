import { h, ref } from "../../lib/mini-vue.esm.js";

const prevChildren = 'oldChildren';
const nextChildren = "newCHildren";

export const TextToText = {
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
