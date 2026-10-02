import { describe, expect, it } from "vitest";

import { en } from "./en";
import { hinglish } from "./hinglish";
import { format } from "./index";

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)]));
  }
  return typeof value;
}

function placeholders(value: unknown, path = ""): Record<string, string[]> {
  if (typeof value === "string") return { [path]: (value.match(/\{\w+\}/g) ?? []).sort() };
  if (value && typeof value === "object") {
    return Object.assign(
      {},
      ...Object.entries(value).map(([k, v]) => placeholders(v, `${path}.${k}`)),
    );
  }
  return {};
}

describe("translations", () => {
  it("Hinglish has exactly the same keys and list lengths as English", () => {
    expect(shape(hinglish)).toEqual(shape(en));
  });

  it("every translation keeps the same {placeholders}", () => {
    expect(placeholders(hinglish)).toEqual(placeholders(en));
  });

  it("format fills placeholders and leaves unknown ones alone", () => {
    expect(format("I think it's a {digit}! {x}", { digit: 7 })).toBe("I think it's a 7! {x}");
  });
});
