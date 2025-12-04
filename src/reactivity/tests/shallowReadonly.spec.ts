import { shallowReadonly } from "../reactive";
import { isReadOnly } from "../reactive";

describe("shallowReadonly", () => {
  it("happy path", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = shallowReadonly(original);
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);

    expect(isReadOnly(wrapped)).toBe(true);
    expect(isReadOnly(wrapped.bar)).toBe(false);
  });

  it("warn then call set", () => {
    console.warn = jest.fn();
    const user = shallowReadonly({
      foo: 1,
      bar: { baz: 2 },
    });
    user.foo = 10;
    expect(console.warn).toHaveBeenCalled();
  });
});
