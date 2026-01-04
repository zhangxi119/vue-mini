import {
  h,
  provide,
  inject,
  getCurrentInstance,
} from "../../lib/mini-vue.esm.js";
// import { Foo } from "./Foo.js";

const Provider = {
  name: "Provider",
  setup() {
    provide("foo", "fooVal");
  },
  render() {
    return h("div", {}, [h("p", {}, "Provider"), h(ProviderTwo)]);
  },
};

const ProviderTwo = {
  name: "ProviderTwo",
  setup() {
    provide("providerTwo", "ProviderTwo");
    provide("foo", "fooVal-tow");
    const foo = inject("foo");
    console.log("foo", foo);
    return {
      foo,
    };
  },
  render() {
    return h("div", {}, [
      h("p", {}, "ProviderTwo-foo: " + this.foo),
      h(Consumer),
    ]);
  },
};

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo");
    const providerTwo = inject("providerTwo");
    return {
      foo,
      providerTwo,
    };
  },
  render() {
    return h("div", {}, [
      h("p", {}, "ConsumerInjectValueFoo - " + this.foo),
      h("p", {}, "ConsumerInjectValueProviderTwo - " + this.providerTwo),
    ]);
  },
};

// 创建App组件
export const App = {
  render() {
    const app = h("p", {}, "App");
    const provider = h(Provider);
    return h("div", {}, [app, provider]);
  },

  setup() {
    const instance = getCurrentInstance();
    console.log(instance);
    return {
      msg: "mini-vue666",
    };
  },
};
