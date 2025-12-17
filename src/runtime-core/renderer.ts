import { createComponentInstance, setupComponent } from "./component";

export function render(vnode: any, container: any) {
  // 调用 patch 挂载
  patch(vnode, container);
}

// 核心方法 - patch
function patch(vnode: any, container: any) {
  // 初次渲染

  // 判断是不是 element 类型 TODO

  processComponent(vnode, container);
}

// 处理组件
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

// 挂载组件
function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode);

  setupComponent(instance);

  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render();

  // vnode -> patch
  // vnode -> element -> patch
  patch(subTree, container);
}
