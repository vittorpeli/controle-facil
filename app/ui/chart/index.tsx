import { cn } from '~/lib/utils'
import {
  buildAreaPath,
  buildLinePath,
  type ChartSeries,
  normalizePoints,
} from './helpers'

export const ChartContainer = ({
  children,
  height = 300,
  className,
}: {
  children: React.ReactNode
  height?: number
  className?: string
}) => (
  <div
    className={cn('chart-container relative w-full', className)}
    style={{ height: `${height}px` }}
  >
    {children}
  </div>
)

export const ChartLegend = ({
  item,
  className,
}: {
  item: { label: string; colorClass: string }[]
  className?: string
}) => (
  <div className={cn('cluster relative z-10', className)}>
    {item.map((item) => (
      <div key={item.label} className="chart-legend cluster">
        <div className={`chart-legend__dot ${item.colorClass}`} />
        <span className="text-step--2 text-dark-glare font-medium">
          {item.label}
        </span>
      </div>
    ))}
  </div>
)

// Wrapper do SVG com o Gradient base
export const ChartCanvas = ({
  className,
  series,
  height,
  width = 1000,
}: {
  className?: string
  series: ChartSeries[]
  height: number
  width?: number
}) => (
  <div className={cn('chart-canvas', className)}>
    <svg
      className="chart-canvas__svg"
      preserveAspectRatio="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <title>Chart Canvas</title>
      <defs>
        <linearGradient id="incomeGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#047857" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#047857" stopOpacity="0" />
        </linearGradient>
      </defs>
      {series.map((serie) => {
        const points = normalizePoints(serie.values, width, height)

        const linePath = buildLinePath(points)
        const areaPath = buildAreaPath(points, height)

        return (
          <g key={serie.label}>
            {serie.area && <ChartArea path={areaPath} />}

            <ChartLine
              path={linePath}
              color={serie.color}
              dashed={serie.dashed}
            />
          </g>
        )
      })}
    </svg>
  </div>
)

// Elementos do Gráfico (Linhas e Áreas)
export const ChartLine = ({
  path,
  color,
  strokeWidth = '2',
  dashed = false,
}: {
  path: string
  color: string
  strokeWidth?: string
  dashed?: boolean
}) => (
  <path
    d={path}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeDasharray={dashed ? '4 4' : 'none'}
  />
)

export const ChartArea = ({
  path,
  fillUrl = 'incomeGrad',
}: {
  path: string
  fillUrl?: string
}) => <path d={path} fill={`url(#${fillUrl})`} />

export const Chart = ({
  series,
  height = 300,
}: {
  series: ChartSeries[]
  height?: number
}) => {
  return (
    <ChartContainer height={height}>
      <ChartLegend
        item={series.map((s) => ({
          label: s.label,
          colorClass: '',
        }))}
      />

      <ChartCanvas height={height} series={series} />
    </ChartContainer>
  )
}
