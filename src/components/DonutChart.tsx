import { useMemo } from "react"

interface DonutChartProps {
  data: Record<string, string | number>[]
  category: string
  value: string
  valueFormatter?: (v: number) => string
  variant?: "donut" | "pie"
  colors?: string[]
}

const defaultColors = [
  "#3b82f6",
  "#8b5cf6",
  "#f43f5e",
  "#10b981",
  "#f59e0b",
  "#06b6d4",
  "#7c3aed",
  "#ec4899",
  "#14b8a6",
  "#f97316",
]

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, startAngle)
  const end = polarToCartesian(cx, cy, r, endAngle)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`
}

export function DonutChart({
  data,
  category,
  value,
  valueFormatter,
  variant = "donut",
  colors = defaultColors,
}: DonutChartProps) {
  const total = data.reduce((s, d) => s + (Number(d[value]) || 0), 0) || 1
  const r = 42
  const innerR = variant === "donut" ? 28 : 0
  const cx = 50
  const cy = 50

  const segments = useMemo(() => {
    return data.map((d, i) => {
      const val = Number(d[value]) || 0
      const angle = (val / total) * 360
      const previousSum = data.slice(0, i).reduce((sum, item) => sum + (Number(item[value]) || 0), 0)
      const startAngle = (previousSum / total) * 360
      const endAngle = startAngle + angle + 0.5
      return { color: colors[i % colors.length], angle, startAngle, endAngle, label: String(d[category]), value: val }
    })
  }, [data, value, category, total, colors])

  const formatter = valueFormatter || ((n: number) => `${n}`)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 100 100">
          {total === 1 && segments[0]?.angle === 0 ? (
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#71717a" strokeWidth="8" className="dark:stroke-white" />
          ) : variant === "pie" ? (
            segments.map((seg) => {
              if (seg.angle < 0.1) return null
              const start = polarToCartesian(cx, cy, r, seg.startAngle)
              const end = polarToCartesian(cx, cy, r, seg.endAngle)
              const large = seg.angle > 180 ? 1 : 0
              return (
                <path
                  key={seg.label}
                  d={`M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`}
                  fill={seg.color}
                />
              )
            })
          ) : (
            <>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3b82f6" strokeWidth="6" className="dark:stroke-blue-500" opacity="0.3" />
              {segments.map((seg) => {
                if (seg.angle < 0.1) return null
                return (
                  <path
                    key={seg.label}
                    d={describeArc(cx, cy, r, seg.startAngle, seg.endAngle)}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                )
              })}
            </>
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-zinc-900 dark:text-white">{formatter(total)}</p>
            <p className="text-[10px] text-zinc-400">Jami</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-xs">
            <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-zinc-500 dark:text-zinc-400 truncate">{seg.label}</span>
            <span className="ml-auto font-medium text-zinc-800 dark:text-zinc-200">{formatter(seg.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
