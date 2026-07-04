"use client"

import { ArrowUp } from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

const weekData = [
  { day: "Dush", value: 5000000, users: 0, admins: 0 },
  { day: "Sesh", value: 0, users: 0, admins: 0 },
  { day: "Chor", value: 0, users: 0, admins: 0 },
  { day: "Pay", value: 0, users: 0, admins: 0 },
  { day: "Jum", value: 0, users: 0, admins: 0 },
  { day: "Shan", value: 0, users: 0, admins: 0 },
  { day: "Yak", value: 0, users: 0, admins: 0 },
]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950">
      <p className="mb-1.5 text-xs font-medium text-zinc-900 dark:text-zinc-200">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-[11px]">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-zinc-500 dark:text-zinc-400">{entry.name === "users" ? "Foydalanuvchilar" : "Adminlar"}:</span>
          <span className="font-medium text-zinc-800 dark:text-zinc-100">{entry.value} kishi</span>
        </div>
      ))}
    </div>
  )
}

function WeeklyBarChart() {
  const maxValue = Math.max(...weekData.map(d => d.value), 100)
  
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#0d0d0d]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Haftalik daromad</h3>
          <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">7 kunlik statistika</p>
        </div>
      </div>

      <div className="space-y-4">
        {weekData.map((item) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
          const barWidth = percentage === 0 ? 1 : percentage
          
          return (
            <div key={item.day} className="flex items-center gap-3">
              <div className="w-12 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                {item.day}
              </div>
              <div className="flex-1 h-8 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-xl transition-all duration-500"
                  style={{ 
                    width: `${barWidth}%`,
                    minWidth: percentage === 0 ? '4px' : undefined
                  }}
                />
              </div>
              <div className="w-16 text-right text-xs font-medium text-zinc-900 dark:text-white">
                {item.value.toLocaleString()} so'm
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ActivityNodeChart() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-[#0d0d0d]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Staff & User Activity Node</h3>
          <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">7 kunlik faollik dinamikasi</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={weekData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} className="dark:stroke-zinc-800" />
          <XAxis
            dataKey="day"
            tick={{ fill: "#a1a1aa", fontSize: 11, fontFamily: "Geist, sans-serif" }}
            axisLine={{ stroke: "#e4e4e7" }}
            tickLine={false}
            padding={{ left: 10, right: 10 }}
            className="dark:[&_.recharts-cartesian-axis-tick-value]:fill-zinc-500"
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            tick={{ fill: "#a1a1aa", fontSize: 10, fontFamily: "Geist, sans-serif", dx: 8 }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#d4d4d8", strokeDasharray: "3 3" }} />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#a78bfa"
            strokeWidth={2.5}
            dot={{ fill: "#a78bfa", stroke: "#fff", strokeWidth: 2, r: 4 }}
            activeDot={{ fill: "#a78bfa", stroke: "#fff", strokeWidth: 2, r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="admins"
            stroke="#34d399"
            strokeWidth={2.5}
            dot={{ fill: "#34d399", stroke: "#fff", strokeWidth: 2, r: 4 }}
            activeDot={{ fill: "#34d399", stroke: "#fff", strokeWidth: 2, r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/30">
        <div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Haftalik foydalanuvchilar</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">0</p>
        </div>
        <div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Haftalik adminlar</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">0</p>
        </div>
        <div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Hozir online</p>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">0</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function EarningProjections() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  const values = [0, 0, 0, 0, 0, 0]

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Earning Projections</h3>
        <div className="flex items-center gap-1 text-xs text-emerald-500 dark:text-emerald-400">
          <ArrowUp className="h-3 w-3" />
          +0%
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        {months.map((m, i) => (
          <div key={m} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="w-full rounded-md bg-gradient-to-t from-blue-600 to-purple-500 transition-all hover:opacity-80"
              style={{ height: `${values[i]}px` }}
            />
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{m}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ActivityNodeChart />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WeeklyBarChart />
        <EarningProjections />
      </div>
    </div>
  )
}
