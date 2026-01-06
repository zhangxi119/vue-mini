import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { ShapeFlags } from "../shared/ShapeFlags";
import { EMPTY_OBJ } from "../shared/index";
import { Fragment, Text } from "./vnode";
import { effect } from "../reactivity";

export function createRenderer(options: any) {
  const {
    createElement: hostCreateElement,
    insert: hostInsert,
    patchProps: hostPatchProps,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;

  function render(vnode: any, container: any) {
    // 调用 patch 挂载
    patch(null, vnode, container, null, null);
  }

  // 核心方法 - patch
  function patch(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
    const { type, shapeFlag } = n2;

    console.log("vnode.type", type);

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent, anchor);
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
    parentComponent: any,
    anchor: any
  ) {
    mountChildren(n2.children, container, parentComponent, anchor);
  }

  // 处理组件
  function processComponent(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    mountComponent(n2, container, parentComponent, anchor);
  }

  // 处理 element
  function processElement(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor);
    } else {
      patchElement(n1, n2, container, parentComponent, anchor);
    }
  }

  function mountElement(vnode: any, container: any, parentComponent: any, anchor: any) {
    const { type, children, props, shapeFlag } = vnode;

    const el = (vnode.el = hostCreateElement(type));

    // children -> string
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el, parentComponent, anchor);
    }

    // props
    for (let key in props) {
      const val = props[key];
      hostPatchProps(el, key, null, val);
    }

    // container.appendChild(el);
    hostInsert(el, container, anchor);
  }

  function patchElement(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    console.log("patchElement");
    console.log("n1", n1);
    console.log("n2", n2);

    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;

    const el = (n2.el = n1.el);
    patchProps(el, oldProps, newProps);
    patchChildren(n1, n2, el, parentComponent, anchor);
  }

  function patchChildren(n1: any, n2: any, container: any, parentComponent: any, anchor: any) {
    const prevShapeFlag = n1.shapeFlag;
    const shapeFlag = n2.shapeFlag;
    const c1 = n1.children;
    const c2 = n2.children;

    // 新节点是文本节点的情况
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 旧子节点是数组,把老的 children 清空
        unmountChildren(n1.children);
      }
      if (c1 !== c2) {
        // 旧子节点是文本})
        hostSetElementText(container, c2);
      }
    } else {
      // 新节点是数组的情况
      // 旧节点是文本
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "");
        mountChildren(n2.children, container, parentComponent, anchor);
      }
      // 旧节点是数组 - Array to Array
      else {
        // 核心diff算法部分
        patchKeyedChildren(c1, c2, container, parentComponent, anchor);
      }
    }

  }

  // 双端对比 - diff
  function patchKeyedChildren(c1: any, c2: any, container: any, parentComponent: any, parentAnchor: any) {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;

    // 1.左侧对比
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVNode(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      i++;
    }
    console.log("左侧对比结束", i);

    // 2.右侧对比
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVNode(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    console.log("右侧对比结束", e1, e2);
    // 3.新的比老的多或者老的比新的多
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : null;
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      // 4.老的比新的多
      while (i <= e1) {
        const el = c1[i].el;
        hostRemove(el);
        i++;
      }
    } else {
      // 5.中间对比 - 最复杂的部分
      // TODO
    }

  }

  function isSameVNode(n1: any, n2: any) {
    // type + key
    return n1.type === n2.type && n1.key === n2.key;
  }

  function unmountChildren(children: any) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el;
      // remove child
      hostRemove(el);
    }
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (let key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];
        if (prevProp !== nextProp) {
          hostPatchProps(el, key, prevProp, nextProp);
        }
      }

      // 删除属性
      if (oldProps !== EMPTY_OBJ) {
        for (let key in oldProps) {
          if (key in newProps) {
            continue;
          }
          const prevProp = oldProps[key];
          hostPatchProps(el, key, prevProp, null);
        }
      }
    }
  }

  // 挂载子元素
  function mountChildren(children: any, container: any, parentComponent: any, anchor: any) {
    children.forEach((v: any) => {
      patch(null, v, container, parentComponent, anchor);
    });
  }

  // 挂载组件
  function mountComponent(
    initialVnode: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    const instance = createComponentInstance(initialVnode, parentComponent);

    setupComponent(instance);

    setupRenderEffect(instance, initialVnode, container, anchor);
  }

  function setupRenderEffect(instance: any, initialVnode, container: any, anchor: any) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        console.log("init subTree", subTree);

        // vnode -> patch
        // vnode -> element -> patch
        patch(null, subTree, container, instance, anchor);

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
        patch(prevSubTree, subTree, container, instance, anchor);

        // element -> mount 挂载后获取el实例，挂载到vnode上
        initialVnode.el = subTree.el;
      }
    });
  }

  return {
    createApp: createAppApi(render),
  };
}
