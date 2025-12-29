export const enum ShapeFlags {
  ELEMENT = 1, // 01 - html元素标签
  STATEFUL_COMPONENT = 1 << 1, // 10  - 有状态的组件
  TEXT_CHILDREN = 1 << 2, // 100  - 文本子节点
  ARRAY_CHILDREN = 1 << 3, // 1000  - 数组子节点
  SLOT_CHILDREN = 1 << 4, // 10000 - 插槽节点
}
