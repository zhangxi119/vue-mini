function createComponentInstance(vnode) {
    var componet = {
        vnode: vnode,
        type: vnode.type,
        props: vnode.props,
        setupState: {},
        ctx: null,
        render: null,
        proxy: null,
    };
    return componet;
}
function setupComponent(instance) {
    // TODO
    // initProps(instance);
    // initSolts(instance);
    // 初始化一个有状态的组件
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function Object
    // TODO function
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    // 调用 patch 挂载
    patch(vnode);
}
// 核心方法 - patch
function patch(vnode, container) {
    // 初次渲染
    // 判断是不是 element 类型 TODO
    processComponent(vnode);
}
// 处理组件
function processComponent(vnode, container) {
    mountComponent(vnode);
}
// 挂载组件
function mountComponent(vnode, container) {
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    var subTree = instance.render();
    // vnode -> patch
    // vnode -> element -> patch
    patch(subTree);
}

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            // vue3 - 先转换为虚拟节点，后续所有的逻辑都基于 vnode 操作
            // componet -> vnode
            var vnode = createVNode(rootComponent);
            // 挂载
            render(vnode);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
//# sourceMappingURL=min-vue.esm.js.map
