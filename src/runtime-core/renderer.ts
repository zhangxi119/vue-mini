import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { ShapeFlags } from "../shared/ShapeFlags";
import { Fragment, Text } from "./vnode";
import { effect } from "../reactivity";

export function createRenderer(options: any) {
  const {
    createElement: hostCreateElement,
    insert: hostInsert,
    patchProps: hostPatchProps,
  } = options;

  function render(vnode: any, container: any) {
    // 调用 patch 挂载
    patch(null, vnode, container, null);
  }

  // 核心方法 - patch
  function patch(n1: any, n2: any, container: any, parentComponent: any) {
    const { type, shapeFlag } = n2;

    console.log("vnode.type", type);

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }

  // 处理 Text
  function processText(n1: any, n2: any, container: any) {
    const el = (n2.el = document.createTextNode(n2.children));
    container.appendChild(el);
  }

  // 处理 Fragment
  function processFragment(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any
  ) {
    mountChildren(n2, container, parentComponent);
  }

  // 处理组件
  function processComponent(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any
  ) {
    mountComponent(n2, container, parentComponent);
  }

  // 处理 element
  function processElement(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any
  ) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container, parentComponent);
    }
  }

  function mountElement(vnode: any, container: any, parentComponent: any) {
    const { type, children, props, shapeFlag } = vnode;

    const el = (vnode.el = hostCreateElement(type));

    // children -> string
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent);
    }

    // props
    for (let key in props) {
      const val = props[key];
      hostPatchProps(el, key, val);
    }

    // container.appendChild(el);
    hostInsert(el, container);
  }

  function patchElement(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any
  ) {
    console.log("patchElement");
    console.log("n1", n1);
    console.log("n2", n2);
    // patchProps(el, oldProps, newProps);
    // patchChildren(n1, n2, el, parentComponent);
  }

  // 挂载子元素
  function mountChildren(vnode: any, container: any, parentComponent: any) {
    vnode.children.forEach((v: any) => {
      patch(null, v, container, parentComponent);
    });
  }

  // 挂载组件
  function mountComponent(
    initialVnode: any,
    container: any,
    parentComponent: any
  ) {
    const instance = createComponentInstance(initialVnode, parentComponent);

    setupComponent(instance);

    setupRenderEffect(instance, initialVnode, container);
  }

  function setupRenderEffect(instance: any, initialVnode, container: any) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        console.log("init subTree", subTree);

        // vnode -> patch
        // vnode -> element -> patch
        patch(null, subTree, container, instance);

        // element -> mount 挂载后获取el实例，挂载到vnode上
        initialVnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        const { proxy } = instance;
        const prevSubTree = instance.subTree;
        const subTree = instance.render.call(proxy);

        instance.subTree = subTree;

        console.log("update subTree", subTree);

        // vnode -> patch
        // vnode -> element -> patch
        patch(prevSubTree, subTree, container, instance);

        // element -> mount 挂载后获取el实例，挂载到vnode上
        initialVnode.el = subTree.el;
      }
    });
  }

  return {
    createApp: createAppApi(render),
  };
}
