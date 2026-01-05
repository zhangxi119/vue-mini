import { h, ref } from "../../lib/mini-vue.esm.js";

// 创建App组件
window.self = null;
export const App = {
  setup() {
    const count = ref(0);

    const props = ref({
      foo: "foo",
      bar: "bar",
    });

    const onClick = () => {
      count.value++;
      console.log("onClick---", count.value);
    };

    const handleChangeProps = () => {
      props.value.foo = "foo-2";
    };

    const handleChangePropsToUndefined = () => {
      props.value.foo = undefined;
    };

    const handleRemovePropsKey = () => {
      props.value = {
        foo: "foo-3",
      };
    };
    return {
      count,
      props,
      onClick,
      handleChangeProps,
      handleChangePropsToUndefined,
      handleRemovePropsKey,
    };
  },
  render() {
    return h(
      "div",
      {
        id: "root",
        class: ["red"],
        ...this.props,
      },
      [
        h("div", {}, `count: ${this.count}`),
        h("button", { onClick: this.onClick }, "click"),
        h("button", { onClick: this.handleChangeProps }, "changeProps"),
        h(
          "button",
          { onClick: this.handleChangePropsToUndefined },
          "changeProps to undefined"
        ),
        h("button", { onClick: this.handleRemovePropsKey }, "removePropsKey"),
      ]
    );
  },
};
