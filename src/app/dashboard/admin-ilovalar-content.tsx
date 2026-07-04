"use client"

import { useState } from "react"
import { Monitor, Shield, Key, CheckCircle, RefreshCw, XCircle, Clock, Snowflake, Send, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface AppSystem {
  id: number
  name: string
  url: string
  status: "active" | "inactive"
  lastSync: string
}

interface AccessLog {
  id: number
  admin: string
  ip: string
  action: string
  timestamp: string
  status: "success" | "warning"
}

// Exactly 2 systems: 1 active/working, 1 blocked/inactive
const initialApps: AppSystem[] = [
  { id: 1, name: "Sanatoriya Hamkor Paneli (Partner Dashboard)", url: "https://partner.sihhat.uz", status: "active", lastSync: "2 daqiqa oldin" },
  { id: 2, name: "Filial Operator Paneli (Branch Panel)", url: "https://branch.sihhat.uz", status: "inactive", lastSync: "1 soat oldin" },
]

// Exactly 1 log entry in activity logs
const initialLogs: AccessLog[] = [
  { id: 1, admin: "admin", ip: "195.158.16.20 (Toshkent)", action: "Sanatoriya qo'shildi", timestamp: "2026-07-04 12:45", status: "success" },
]

export function AdminIlovalarContent() {
  const [systems, setSystems] = useState<AppSystem[]>(initialApps)
  const [logs, setLogs] = useState<AccessLog[]>(initialLogs)
  const [adminPushText, setAdminPushText] = useState("")
  const [isFreezingActive, setIsFreezingActive] = useState(false)

  const toggleStatus = (id: number) => {
    setSystems(systems.map(sys => sys.id === id ? { ...sys, status: sys.status === "active" ? "inactive" : "active" } : sys))
  }

  const handleSendAdminPush = () => {
    if (!adminPushText.trim()) return
    window.dispatchEvent(new CustomEvent("show-success-notification", { detail: { message: "Admin ilovalariga push-xabarnoma muvaffaqiyatli yuborildi!" } }))
    setAdminPushText("")
  }

  const handleFreezeOn = () => {
    setIsFreezingActive(true)
    setSystems(systems.map(sys => ({ ...sys, status: "inactive" })))
    window.dispatchEvent(new CustomEvent("show-success-notification", { detail: { message: "Barcha admin ilovalari muzlatildi!" } }))
  }

  const handleFreezeOff = () => {
    setIsFreezingActive(false)
    setSystems(systems.map((sys, idx) => ({ ...sys, status: idx === 0 ? "active" : "inactive" })))
    window.dispatchEvent(new CustomEvent("show-success-notification", { detail: { message: "Muzlatish o'chirildi (Turn Off)!" } }))
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
          <Monitor className="h-6 w-6 text-cyan-600 dark:text-cyan-400" /> Admin Ilovalarini Boshqarish
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Tizim administratorlari va hamkorlari foydalanadigan veb ilovalar hamda sessiyalar nazorati</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Systems and Push Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Admin Applications list (exactly 2) */}
          <Card className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">Admin ilovalari</h3>
            <div className="space-y-4">
              {systems.map((sys) => (
                <div key={sys.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20 gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-950 dark:text-white flex items-center gap-2">
                      {sys.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">{sys.url}</p>
                    <p className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Oxirgi faollik: {sys.lastSync}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {sys.status === "active" ? (
                      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400 rounded-full">
                        Ishlamoqda
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400 rounded-full">
                        Muzlatilgan
                      </Badge>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(sys.id)}
                      className="rounded-lg h-9 text-xs border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                      {sys.status === "active" ? "Muzlatish" : "Yoqish"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Send push notification to admin apps */}
          <Card className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Send className="h-4.5 w-4.5 text-cyan-500" /> Admin ilovalariga Push Bildirishnoma yuborish
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-push-text">Xabar matni</Label>
                <Textarea
                  id="admin-push-text"
                  value={adminPushText}
                  onChange={(e) => setAdminPushText(e.target.value)}
                  placeholder="Admin panellarga yuboriladigan tizim xabarini kiriting..."
                  rows={2}
                  className="rounded-xl py-3 px-4 bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleSendAdminPush} 
                  disabled={!adminPushText.trim()}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <Send className="h-4 w-4" /> Yuborish
                </Button>
              </div>
            </div>
          </Card>

          {/* Admin activity logs (exactly 1 log) */}
          <Card className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">Admin faollik jurnali</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-500 dark:text-zinc-400 font-semibold">
                    <th className="px-4 py-3">Admin</th>
                    <th className="px-4 py-3">Amal</th>
                    <th className="px-4 py-3">IP manzil</th>
                    <th className="px-4 py-3">Vaqti</th>
                    <th className="px-4 py-3">Holat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 text-zinc-600 dark:text-zinc-400">
                      <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">{log.admin}</td>
                      <td className="px-4 py-3">{log.action}</td>
                      <td className="px-4 py-3 font-mono">{log.ip}</td>
                      <td className="px-4 py-3 text-zinc-400">{log.timestamp}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle className="h-3.5 w-3.5" /> Muvaffaqiyatli
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <Card className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800 space-y-6">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-500" /> Tezkor Muzlatish
            </h3>
            
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Barcha hamkor va operator ilovalarini bitta tugma orqali vaqtincha muzlatib qo'yishingiz mumkin.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button 
                onClick={handleFreezeOn}
                className="h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <Snowflake className="h-4 w-4" /> Turn On
              </Button>
              <Button 
                onClick={handleFreezeOff}
                variant="outline"
                className="h-10 rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                Turn Off
              </Button>
            </div>
          </Card>

          <Card className="p-5 bg-cyan-50/50 dark:bg-cyan-950/10 border-cyan-200 dark:border-cyan-900/40 text-xs text-cyan-700 dark:text-cyan-300 leading-relaxed">
            <h4 className="font-bold mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> Xavfsizlik bo'yicha maslahat
            </h4>
            <p>
              Tizimlarni muzlatish (Turn On) amali faqat favqulodda xavf yuz berganda qo'llanilishi tavsiya etiladi.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
