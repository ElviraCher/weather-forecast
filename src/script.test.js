import { init } from "./script";

describe("init", () => {
  it("is a function", () => {
    expect(init).toBeInstanceOf(Function);
  });

  it("creates input, button and paragraph inside element", () => {
    const el = document.createElement("div");
    init(el);
    const list = el.querySelector("p");
    const button = el.querySelector("button");
    const input = el.querySelector("input");

    expect(list).not.toBe(null);
    expect(button).not.toBe(null);
    expect(input).not.toBe(null);
  });
});
