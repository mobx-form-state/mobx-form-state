export namespace assert {
  export function exists<T>(x: T, message: string): asserts x is NonNullable<T> {
    if (x == null) {
      throw new Error(`assertExists: ${message}`);
    }
  }
}
