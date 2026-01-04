import { createRenderer } from "../runtime-core/renderer";

function createElement(type: string) {
  console.log("createElement");
  return document.createElement(type);
}

function insert(el: any, parent: any) {
  parent.appendChild(el);
}

function patchProps(el: any, key: any, value: any) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    // const eventKey = key.split("on")[1]?.toLowerCase();
    const event = key.slice(2).toLowerCase();
    console.log("eventKey", event);
    el.addEventListener(event, value);
  } else {
    el.setAttribute(key, value);
  }
}

export const renderer: any = createRenderer({
  createElement,
  insert,
  patchProps,
});

export const createApp = (...args) => {
  return renderer.createApp(...args);
};

export * from "../runtime-core/index";
