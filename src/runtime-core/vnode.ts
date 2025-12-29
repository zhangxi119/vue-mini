import { ShapeFlags } from "../shared/ShapeFlags";

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    shapeFlag: getShapeFlag(type),
    el: null,
  };

  // children
  if (typeof children === "string") {
    // 位运算，使用 | 来设置(都是0，结果为0），使用 & 来判断（都是1，结果为1）
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }

  // 组件 + children object -> slots
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === "object") {
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN;
    }
  }

  return vnode;
}

function getShapeFlag(type: any) {
  if (typeof type === "string") {
    return ShapeFlags.ELEMENT;
  } else {
    return ShapeFlags.STATEFUL_COMPONENT;
  }
}
