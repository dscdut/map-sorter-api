export class Identifier<T> {
  constructor(private value: T) {
    this.value = value;
  }

  equals(id?: Identifier<T>): boolean {
    if (id === null || id === undefined) {
      return false;
    }

    if (!(id instanceof this.constructor)) {
      return false;
    }

    return id.toValue() === this.value;
  }

  toString(): string {
    return String(this.value);
  }

  // Returns the raw value of the identifier
  toValue(): T {
    return this.value;
  }
}
