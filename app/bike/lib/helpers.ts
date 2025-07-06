import Coordinates from "./Coordinates";

export const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const toDegrees = (radians: number) => (radians * 180) / Math.PI;

export const distance = (start: Coordinates, end: Coordinates) =>
  Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);

export const rotate = (
  coordinates: Coordinates,
  angle: number,
  origin: Coordinates = { x: 0, y: 0 },
): Coordinates => {
  return {
    x:
      (coordinates.x - origin.x) * Math.cos(angle) -
      (coordinates.y - origin.y) * Math.sin(angle) +
      origin.x,
    y:
      (coordinates.x - origin.x) * Math.sin(angle) +
      (coordinates.y - origin.y) * Math.cos(angle) +
      origin.y,
  };
};
