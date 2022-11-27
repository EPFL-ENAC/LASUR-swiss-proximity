import { ExpressionSpecification } from "maplibre-gl";

export const mapColors = [
  "#1a9850",
  "#66bd63",
  "#a6d96a",
  "#d9ef8b",
  "#ffffbf",
  "#fee08b",
  "#fdae61",
  "#f46d43",
  "#d73027",
];

export const hexagonsResolutions = [6, 7, 8];

export const center = [-837, 9380];
export const scale = 61878;

export function expressionMean(
  attributes: string[]
): ExpressionSpecification | number {
  if (attributes.length == 0) return 0;
  const n = attributes.length;
  const values = attributes.map((attr: string) => ["to-number", ["get", attr]]);
  if (values.length == 1) return values[0] as ExpressionSpecification;
  const total = values.reduce(
    (acc, curr) => ["+", acc, curr] as (string | string[])[]
  );
  return ["/", total, n] as ExpressionSpecification;
}

export function stepsColors(min: number, max: number, colors: string[]) {
  const diff = max - min,
    n = colors.length - 1,
    step = ~~(diff / n);
  const returnVal = [];
  for (let i = 1; i < n; i++) {
    returnVal.push(i * step);
    returnVal.push(colors[i]);
  }
  return returnVal;
}
