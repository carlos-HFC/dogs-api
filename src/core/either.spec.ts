import { left, right } from "./either";

function something(isSuccess: boolean) {
  if (isSuccess) {
    return right(10);
  }

  return left('error');
}

describe("Either", () => {
  it("should be returned success result", () => {
    const result = something(true);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
  });

  it("should be returned error result", () => {
    const result = something(false);

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
  });
});