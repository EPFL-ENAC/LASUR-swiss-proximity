export interface Hexagon {
  id: string;
  amenity: number;
  transit: number;
}

export interface DrawHexagon {
  points: [number, number][];
  colorAmenity: string;
  colorTransit: string;
}

export interface DrawGroup {
  color: string;
  path: Path2D;
}
