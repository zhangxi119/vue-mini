import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode: any, container: any) {
  // 调用 patch 挂载
  patch(vnode, container);
}

// 核心方法 - patch
function patch(vnode: any, container: any) {
  // 初次渲染

  // 判断是不是 element 类型 TODO
  console.log(vnode.type);

  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container);
  }
}

// 处理组件
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

// 处理 element
function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const { type, children, props } = vnode;

  const el = document.createElement(type);

  // children -> string
  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el);
  }

  // props
  for (let key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }

  container.appendChild(el);
}

// 挂载子元素
function mountChildren(vnode: any, container: any) {
  vnode.children.forEach((v: any) => {
    patch(v, container);
  });
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
