"use client"

import { useState } from "react"
import { Monitor, Smartphone, Shield, LogOut, Check, AlertCircle, Cpu, Wifi } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Device {
  id: string
  name: string
  type: "desktop" | "mobile"
  os: string
  browser: string
  ip: string
  location: string
  provider: string
  lastActive: string
  sessionStart: string
  isCurrent: boolean
}

// Highly precise active sessions list accessing this Staff Admin panel
const initialDevices: Device[] = [
  { 
    id: "DEV-01", 
    name: "HP ProBook Desktop PC", 
    type: "desktop", 
    os: "Windows 11 Pro (build 22631)", 
    browser: "Google Chrome v126.0.6478", 
    ip: "195.158.16.20", 
    location: "Toshkent shahri, Yunusobod tumani", 
    provider: "Sarkor Telecom (FTTH)",
    lastActive: "Hozir faol", 
    sessionStart: "2026-07-04 19:40",
    isCurrent: true 
  },
  { 
    id: "DEV-02", 
    name: "Apple iPhone 15 Pro", 
    type: "mobile", 
    os: "iOS 17.5.1", 
    browser: "Safari Mobile v17.5", 
    ip: "213.230.96.105", 
    location: "Samarqand viloyati, Samarqand shahri", 
    provider: "Ucell Uzbekistan (5G)",
    lastActive: "3 soat oldin", 
    sessionStart: "2026-07-04 15:10",
    isCurrent: false 
  },
  { 
    id: "DEV-03", 
    name: "MacBook Air M2", 
    type: "desktop", 
    os: "macOS Sonoma 14.5", 
    browser: "Safari v17.4.1", 
    ip: "85.22.40.11", 
    location: "Toshkent shahri, Yakkasaroy tumani", 
    provider: "Uzonline ADSL",
    lastActive: "Kuni kecha 21:15", 
    sessionStart: "2026-07-03 20:30",
    isCurrent: false 
  },
]

export function QurilmalarContent() {
  const [devices, setDevices] = useState<Device[]>(initialDevices)

  const handleRevoke = (id: string) => {
    setDevices(devices.filter(d => d.id !== id))
  }

  const handleRevokeAll = () => {
    if (confirm("Haqiqatan ham barcha boshqa seanslarni yakunlamoqchimisiz?")) {
      setDevices(devices.filter(d => d.isCurrent))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <Monitor className="h-6 w-6 text-orange-600 dark:text-orange-400" /> Tizimga kirgan qurilmalar (Devices)
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Staff Admin panelga faol kirish sessiyasiga ega qurilmalarning batafsil ma'lumotlari</p>
        </div>
        {devices.length > 1 && (
          <Button onClick={handleRevokeAll} variant="outline" className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/40 dark:hover:bg-red-950/20">
            Boshqa qurilmalarni chiqarib yuborish
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Devices list cards */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence initial={false}>
            {devices.map((device) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800 ${device.isCurrent ? "ring-1 ring-blue-500 dark:ring-blue-600" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 shrink-0">
                        {device.type === "desktop" ? <Monitor className="h-6 w-6" /> : <Smartphone className="h-6 w-6" />}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-zinc-950 dark:text-white">{device.name}</h3>
                          {device.isCurrent && (
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-400 rounded-full text-[10px] py-0">
                              Ushbu qurilma (Joriy)
                            </Badge>
                          )}
                        </div>

                        {/* Precise Specifications */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <Cpu className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                            <span>Tizim: <strong>{device.os}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Monitor className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                            <span>Brauzer: <strong>{device.browser}</strong></span>
                          </div>
                          <div>
                            IP-manzil: <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{device.ip}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Wifi className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                            <span>Provayder: <strong>{device.provider}</strong></span>
                          </div>
                          <div>
                            Joylashuv: <span className="text-zinc-800 dark:text-zinc-200">{device.location}</span>
                          </div>
                          <div>
                            Sessiya boshlangan sana: <span className="text-zinc-800 dark:text-zinc-200">{device.sessionStart}</span>
                          </div>
                        </div>

                        <div className="pt-1 flex items-center gap-1.5 text-[10px] text-zinc-400">
                          <span className="relative flex h-1.5 w-1.5">
                            {device.isCurrent ? (
                              <>
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              </>
                            ) : (
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-zinc-400" />
                            )}
                          </span>
                          Oxirgi faollik vaqti: {device.lastActive}
                        </div>
                      </div>
                    </div>

                    {!device.isCurrent && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRevoke(device.id)}
                        className="text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                        title="Seansni o'chirish"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Security Summary */}
        <div className="space-y-6">
          <Card className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" /> Havfsizlik Nazorati
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Qurilmalar ro'yxatida tizimga kirgan barcha faol seanslarning aniq OS turi, brauzer versiyasi, provayder va IP manzil ma'lumotlari ko'rsatiladi. Agar shubhali qurilma aniqlansa, seansni tugatish tugmasini bosing.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
