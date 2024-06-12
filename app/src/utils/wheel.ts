export class Wheel {
  radius: number = 0;
  tireWidth: number = 0;

  constructor(
    diameter: number = 0,
    tireWidth: number = 0
  ) {
    this.radius = diameter / 2;
    this.tireWidth = tireWidth;
  }

  get radiusWithTire(): number {
    return this.radius + this.tireWidth;
  }

}
