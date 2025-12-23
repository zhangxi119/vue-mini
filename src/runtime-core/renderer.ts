import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";
import { ShapeFlags } from "../shared/ShapeFlags";

export function render(vnode: any, container: any) {
  // 调用 patch 挂载
  patch(vnode, container);
}

// 核心方法 - patch
function patch(vnode: any, container: any) {
  // 初次渲染

  // 判断是不是 element 类型 TODO
  console.log(vnode.type);
  const { shapeFlag } = vnode;

  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
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
  const { type, children, props, shapeFlag } = vnode;

  const el = (vnode.el = document.createElement(type));

  // children -> string
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
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
function mountComponent(initialVnode: any, container: any) {
  const instance = createComponentInstance(initialVnode);

  setupComponent(instance);

  setupRenderEffect(instance, initialVnode, container);
}

function setupRenderEffect(instance: any, initialVnode, container: any) {
  const { proxy } = instance;

  const subTree = instance.render.call(proxy);

  // vnode -> patch
  // vnode -> element -> patch
  patch(subTree, container);

  // element -> mount 挂载后获取el实例，挂载到vnode上
  initialVnode.el = subTree.el;
}
