import { createRenderer } from "../runtime-core/renderer";

function createElement(type: string) {
  return document.createElement(type);
}

function insert(el: any, parent: any, anchor: any = null) {
  // parent.appendChild(el);
  parent.insertBefore(el, anchor);
}

function patchProps(el: any, key: any, prevValue: any, nextValue: any) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, nextValue);
  } else {
    // 删除属性
    if (nextValue === undefined || nextValue === null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextValue);
    }
  }
}

function remove(el: any) {
  const parent = el.parentNode;
  if (parent) {
    parent.removeChild(el);
  }
}

function setElementText(el: any, text: string) {
  el.textContent = text;
}

export const renderer: any = createRenderer({
  createElement,
  insert,
  patchProps,
  remove,
  setElementText,
});

export const createApp = (...args) => {
  return renderer.createApp(...args);
};

export * from "../runtime-core/index";
