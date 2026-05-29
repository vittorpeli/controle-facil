import { useMemo } from 'react'
import { buildAreaPath, buildLinePath, normalizePoints } from './helpers'

export function useChartPath(values: number[], height: number, width = 1000) {
  return useMemo(() => {
    const points = normalizePoints(values, width, height)

    return {
      linePath: buildLinePath(points),
      areaPath: buildAreaPath(points, height),
    }
  }, [values, width, height])
}
