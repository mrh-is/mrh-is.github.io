export function randomBetween(a: number, b: number): number {
  return Math.floor(Math.random() * (b - a + 1) + a);
}

export class Range {
  min: number;
  max: number;
  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  size(): number {
    return this.max - this.min;
  }
}
export function scale(value: number, fromRange: Range, toRange: Range): number {
  const normalizedValue = (value - fromRange.min) / fromRange.size();
  return (normalizedValue * toRange.size()) + toRange.min;
}
