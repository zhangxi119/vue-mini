export const extend = Object.assign;

export const isObject = (val) => {
  return val !== null && typeof val === "object";
};

export const hasChange = (val, oldVal) => {
  return !Object.is(val, oldVal);
};

export const hasOwn = (obj: any, key: string) =>
  Object.prototype.hasOwnProperty.call(obj, key);
