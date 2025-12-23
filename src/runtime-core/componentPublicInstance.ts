const publicPropertiesMap = {
  $el: (i: any) => i.vnode.el,
};

export const PublicInstanceProxyHandlers = {
  get({ _: instance }: any, key: string) {
    const { setupState, props } = instance;
    if (key in setupState) {
      return setupState[key];
    }

    // if (key in props) {
    //   return props[key];
    // }

    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
