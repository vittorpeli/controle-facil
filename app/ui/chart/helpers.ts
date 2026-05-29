export type ChartSeries = {
  label: string
  values: number[]
  color: string
  dashed?: boolean
  area?: boolean
}

type Point = {
  x: number
  y: number
}

export function normalizePoints(
  values: number[],
  width: number,
  height: number,
): Point[] {
  const max = Math.max(...values)

  return values.map((value, index) => ({
    x: (index / (values.length - 1)) * width,
    y: height - (value / max) * height,
  }))
}

export function buildLinePath(points: Point[]) {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`)
    .join(' ')
}

export function buildAreaPath(points: Point[], height: number) {
  const line = buildLinePath(points)

  const last = points[points.length - 1]
  const first = points[0]

  return `${line} L${last.x},${height} L${first.x},${height} Z`
}
