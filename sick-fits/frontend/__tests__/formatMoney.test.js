import { formatMoney } from "../lib/formatMoney";

describe("formatMoney function", () => {
  it("works with fractional dollars", () => {
    expect(formatMoney(1)).toEqual("$0.01");
    expect(formatMoney(10)).toEqual("$0.10");
  });

  it("Works with non-fractional dollars", () => {
    expect(formatMoney(100)).toEqual("$1.00");
    expect(formatMoney(14500)).toEqual("$145.00");
  });

  it("Works with full dollars + cents", () => {
    expect(formatMoney(145)).toEqual("$1.45");
    expect(formatMoney(124145)).toEqual("$1,241.45");
  });
});
