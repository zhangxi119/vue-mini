import { extend } from "../shared";

let activeEffect;
let shouldTrack;
const targetMap = new Map();

class ReactiveEffect {
  private _fn: any;
  public deps: any = new Set();
  // 是否是激活状态（非stop状态）
  public active = true;
  onStop?: () => void;
  constructor(fn, public scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    // 如果当前effect是stop状态，则直接执行fn
    if (!this.active) {
      return this._fn();
    }
    // 打开是否收集开关
    shouldTrack = true;
    // 依赖（effect 副作用) 收集
    activeEffect = this;
    // 执行fn
    const result = this._fn();
    // 关闭是否收集开关
    shouldTrack = false;
    // 返回结果
    return result;
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      this.active = false;
      // 触发onStop回调
      this.onStop?.();
    }
  }
}

// 清除依赖
function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => dep.delete(effect));
  effect.deps.clear();
}

// effect 注册副作用函数
export function effect(fn, options?: any) {
  // fn
  const _effect = new ReactiveEffect(fn, options?.scheduler);

  extend(_effect, options);

  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner; // 返回一个函数，这个函数可以被调用，调用后会执行 _effect.run()
}

export function stop(runner) {
  runner.effect.stop();
}

// 依赖收集
export function track(target, key) {
  if (!isTracking()) return;

  let depsMap = targetMap.get(target);

  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);

  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  if (dep.has(activeEffect)) return;
  dep.add(activeEffect);
  // activeEffect反向收集dep
  activeEffect?.deps?.add(dep);
}

function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

// 依赖触发
export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const dep = depsMap.get(key);
  if (dep) {
    // dep.forEach((effect) => effect.run());
    for (const effect of dep) {
      if (effect.scheduler) {
        effect.scheduler();
      } else {
        effect?.run();
      }
    }
  }
}
