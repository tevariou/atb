import Coordinates from "./Coordinates";

export default class Point {
  coordinates: Coordinates = {
    x: 0,
    y: 0,
  };

  constructor(coordinates: Coordinates) {
    this.coordinates = coordinates;
  }
}
