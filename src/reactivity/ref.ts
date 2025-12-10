import { trackEffects, triggerEffects, isTracking } from "./effect";
import { reactive } from "./reactive";
import { hasChange, isObject } from "../shared";

class RefImpl {
  private _value: any;
  private _rawValue: any;

  public dep: Set<any>;
  public __v_isRef = true;
  constructor(value) {
    this._rawValue = value;
    // 转换value
    this._value = convert(value);

    this.dep = new Set();
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newValue) {
    // 判断新老值是否相同 - hasChange
    // 对比的时候 - object
    if (hasChange(newValue, this._rawValue)) {
      // 先修改值
      this._rawValue = newValue;
      this._value = convert(newValue);
      // 触发依赖
      triggerEffects(this.dep);
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

export function isRef(ref) {
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}

export function ref(value: any): any {
  return new RefImpl(value);
}
