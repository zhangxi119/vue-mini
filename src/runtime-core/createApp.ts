import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createApp(rootComponent: any) {
  return {
    mount(rootContainer: any) {
      // vue3 - 先转换为虚拟节点，后续所有的逻辑都基于 vnode 操作
      // componet -> vnode
      const vnode = createVNode(rootComponent);

      // 挂载
      render(vnode, rootContainer);
    },
  };
}
