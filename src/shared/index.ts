export const extend = Object.assign;

export const isObject = (val) => {
  return val !== null && typeof val === "object";
};

export const hasChange = (val, oldVal) => {
  return !Object.is(val, oldVal);
};

export const hasOwn = (obj: any, key: string) =>
  Object.prototype.hasOwnProperty.call(obj, key);

// add-foo -> addFoo(处理烤肉串写法的 emit 事件名称)
export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : "";
  });
};

// 字符串首字母变为大写
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// 给事件字符串前加上on，以匹配props内的名称
export const toHandlerKey = (str: string) => {
  return str ? "on" + capitalize(str) : "";
};

export const EMPTY_OBJ = {};
