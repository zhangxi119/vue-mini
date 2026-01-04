import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { ShapeFlags } from "../shared/ShapeFlags";
import { Fragment, Text } from "./vnode";

export function createRenderer(options: any) {
  const {
    createElement: hostCreateElement,
    insert: hostInsert,
    patchProps: hostPatchProps,
  } = options;

  function render(vnode: any, container: any) {
    // 调用 patch 挂载
    patch(vnode, container, null);
  }

  // 核心方法 - patch
  function patch(vnode: any, container: any, parentComponent: any) {
    const { type, shapeFlag } = vnode;

    console.log("vnode.type", type);

    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parentComponent);
        }
        break;
    }
  }

  // 处理 Text
  function processText(vnode: any, container: any) {
    const el = (vnode.el = document.createTextNode(vnode.children));
    container.appendChild(el);
  }

  // 处理 Fragment
  function processFragment(vnode: any, container: any, parentComponent: any) {
    mountChildren(vnode, container, parentComponent);
  }

  // 处理组件
  function processComponent(vnode: any, container: any, parentComponent: any) {
    mountComponent(vnode, container, parentComponent);
  }

  // 处理 element
  function processElement(vnode: any, container: any, parentComponent: any) {
    mountElement(vnode, container, parentComponent);
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
      // const isOn = (key: string) => /^on[A-Z]/.test(key);
      // if (isOn(key)) {
      //   // const eventKey = key.split("on")[1]?.toLowerCase();
      //   const event = key.slice(2).toLowerCase();
      //   console.log("eventKey", event);
      //   el.addEventListener(event, val);
      // } else {
      //   el.setAttribute(key, val);
      // }
      hostPatchProps(el, key, val);
    }

    // container.appendChild(el);
    hostInsert(el, container);
  }

  // 挂载子元素
  function mountChildren(vnode: any, container: any, parentComponent: any) {
    vnode.children.forEach((v: any) => {
      patch(v, container, parentComponent);
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
    const { proxy } = instance;

    const subTree = instance.render.call(proxy);

    // vnode -> patch
    // vnode -> element -> patch
    patch(subTree, container, instance);

    // element -> mount 挂载后获取el实例，挂载到vnode上
    initialVnode.el = subTree.el;
  }

  return {
    createApp: createAppApi(render),
  };
}
