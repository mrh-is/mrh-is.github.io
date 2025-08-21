import { Range } from "$lib/mathHelpers";

export class DeterministicVendor {
  private state: number;

  constructor(seed: string) {
    // Create initial state from string seed
    this.state =
      Array.from(seed).reduce((acc, char) => {
        return (acc << 5) - acc + char.charCodeAt(0);
      }, 0) >>> 0; // Ensure 32-bit unsigned

    // Avoid zero state
    if (this.state === 0) {
      this.state = 1;
    }
  }

  next(): number {
    // xorshift algorithm
    this.state ^= this.state << 13;
    this.state ^= this.state >> 17;
    this.state ^= this.state << 5;

    // Return value between 0 and 1
    return (this.state >>> 0) / 4294967296;
  }

  nextBetween(min: number, max: number): number {
    return this.nextIn(new Range(min, max));
  }

  nextIn(range: Range): number {
    return range.min + this.next() * (range.max - range.min);
  }
}
