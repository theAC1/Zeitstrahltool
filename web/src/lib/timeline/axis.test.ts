import { describe, it, expect } from "vitest";
import { generateTicks } from "./axis";

describe("generateTicks", () => {
  it("returns a single value when min equals max", () => {
    expect(generateTicks(2000, 2000)).toEqual([2000]);
  });

  it("generates ticks with an explicit step", () => {
    const ticks = generateTicks(-44, 1989, { step: 500 });
    expect(ticks).toEqual([-500, 0, 500, 1000, 1500, 2000]);
  });

  it("generates nice ticks automatically for a large span", () => {
    const ticks = generateTicks(-44, 1989);
    expect(ticks).toEqual([-500, 0, 500, 1000, 1500, 2000]);
  });

  it("generates nice ticks for a clean range", () => {
    const ticks = generateTicks(0, 1000);
    expect(ticks).toEqual([0, 200, 400, 600, 800, 1000]);
  });

  it("handles small ranges with integer ticks", () => {
    const ticks = generateTicks(1990, 1995);
    expect(ticks).toEqual([1990, 1991, 1992, 1993, 1994, 1995]);
  });
});
