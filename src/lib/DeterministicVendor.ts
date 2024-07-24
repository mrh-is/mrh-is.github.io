import { scale, Range } from "$lib/mathHelpers";
import md5 from "md5";

// Provide random–looking numbers, but based on an input
export class DeterministicVendor {
  private readonly bytes: number[];
  private index = 0;
  constructor(seed: string) {
    this.bytes = md5(seed, { asBytes: true });
  }

  next(): number {
    const byte = this.bytes[this.index];
    this.index = (this.index + 1) % this.bytes.length;
    return byte;
  }

  private readonly valueRange = new Range(0, 2 ** 8);
  nextBetween(min: number, max: number): number {
    return this.nextIn(new Range(min, max));
  }

  nextIn(range: Range): number {
    const value = this.next();
    return scale(value, this.valueRange, range);
  }
}
