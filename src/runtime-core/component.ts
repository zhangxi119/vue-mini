import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initProps } from "./componentProps";
import { initSlots } from "./componentSlot";
import { emit } from "./componentEmit";
import { shallowReadonly } from "../reactivity/reactive";

export function createComponentInstance(vnode: any, parent: any) {
  console.log("parentComponent", parent);
  const componet = {
    vnode,
    type: vnode.type,
    props: vnode.props,
    setupState: {},
    ctx: null,
    render: null,
    proxy: null,
    emit: () => {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent,
  };

  componet.emit = emit.bind(null, componet) as any;

  return componet;
}

export function setupComponent(instance: any) {
  // TODO
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);

  // 初始化一个有状态的组件
  setupStatefulComponent(instance);
}

export function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

  const { setup } = Component;

  if (setup) {
    setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance: any, setupResult: any) {
  // function Object
  // TODO function
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;

  if (Component.render) {
    instance.render = Component.render;
  }
}

let currentInstance = null;

export function getCurrentInstance() {
  return currentInstance;
}

export function setCurrentInstance(instance) {
  currentInstance = instance;
}
