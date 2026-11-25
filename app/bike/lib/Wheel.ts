// Importers also supply nominal wheel sizes such as 29 or 700C.
export function wheelDiameterMm(
  field: { value: number | null; unit: string | null } | null,
) {
  if (!field?.value) return 0;
  if (field.unit === "cm") return field.value * 10;
  switch (field.value) {
    case 20:
      return 406;
    case 26:
      return 559;
    case 27.5:
    case 650:
      return 584;
    case 28:
    case 29:
    case 700:
      return 622;
    default:
      return field.unit === "mm" ? field.value : 0;
  }
}

export default class Wheel {
  radius: number = 0;
  tireWidth: number = 0;

  constructor(diameter: number = 0, tireWidth: number = 0) {
    this.radius = diameter / 2;
    this.tireWidth = tireWidth;
  }

  get radiusWithTire(): number {
    return this.radius + this.tireWidth;
  }
}
