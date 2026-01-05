import { camelize, toHandlerKey } from "../shared/index";

export function emit(instance, event, ...args) {
  const { props } = instance;

  // 处理emit提交的事件名称以匹配查找组件props内的对应事件名称
  const handler = props[toHandlerKey(camelize(event))];
  handler && handler(...args);
}
