import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode: any) {
  const componet = {
    vnode,
    type: vnode.type,
    props: vnode.props,
    setupState: {},
    ctx: null,
    render: null,
    proxy: null,
  };

  return componet;
}

export function setupComponent(instance: any) {
  // TODO
  // initProps(instance);
  // initSolts(instance);

  // 初始化一个有状态的组件
  setupStatefulComponent(instance);
}

export function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

  const { setup } = Component;

  if (setup) {
    const setupResult = setup();
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
