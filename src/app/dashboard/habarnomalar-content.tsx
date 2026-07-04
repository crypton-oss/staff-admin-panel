"use client"

import { useState } from "react"
import { ArrowLeft, Search, CheckCheck, Bell, Trash2, Calendar, ShieldAlert, Wallet, UserPlus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

interface NotificationItem {
  id: string
  type: "user" | "payment" | "admin" | "system"
  title: string
  message: string
  time: string
  isRead: boolean
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    type: "user",
    title: "Yangi Bron Kiritildi",
    message: "Foydalanuvchi Farrux Olimov (patient) Chortoq sanatoriysiga yangi buyurtma kiritdi.",
    time: "5 daqiqa oldin",
    isRead: false
  },
  {
    id: "2",
    type: "payment",
    title: "Muvaffaqiyatli To'lov",
    message: "Booking #102 uchun 2,400,000 so'm miqdorida to'lov muvaffaqiyatli qabul qilindi (Tranzaksiya: CLICK-9912384).",
    time: "20 daqiqa oldin",
    isRead: false
  },
  {
    id: "3",
    type: "admin",
    title: "Tizimga Kirish (Admin)",
    message: "Administrator (admin) Toshkent shahridan HP ProBook Desktop PC qurilmasi orqali tizimga kirdi.",
    time: "1 soat oldin",
    isRead: true
  },
  {
    id: "4",
    type: "system",
    title: "Ilova Sozlamalari Yangilandi",
    message: "Mobil ilovaning yangilanish eslatmasi (appVersion: 1.0.4) muvaffaqiyatli yoqildi.",
    time: "Bugun, 10:30",
    isRead: true
  }
]

export function HabarnomalarContent() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const [search, setSearch] = useState("")

  const handleGoBack = () => {
    window.dispatchEvent(new CustomEvent("change-active-section", { detail: { id: "dashboard" } }))
  }

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    window.dispatchEvent(
      new CustomEvent("show-success-notification", {
        detail: { message: "Barcha xabarnomalar o'qilgan deb belgilandi!" }
      })
    )
  }

  const toggleReadStatus = (id: string) => {
    setNotifications(notifications.map(n => {
      if (n.id === id) {
        const nextStatus = !n.isRead
        window.dispatchEvent(
          new CustomEvent("show-success-notification", {
            detail: { message: nextStatus ? "Xabarnoma o'qildi" : "Xabarnoma o'qilmagan deb belgilandi" }
          })
        )
        return { ...n, isRead: nextStatus }
      }
      return n
    }))
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications(notifications.filter(n => n.id !== id))
    window.dispatchEvent(
      new CustomEvent("show-success-notification", {
        detail: { message: "Xabarnoma muvaffaqiyatli o'chirildi!" }
      })
    )
  }

  const filtered = notifications.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.message.toLowerCase().includes(search.toLowerCase())
  )

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Go back */}
        <div className="flex items-center gap-3 shrink-0">
          <Button 
            onClick={handleGoBack}
            variant="outline"
            className="h-11 w-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121212] text-zinc-650 dark:text-zinc-300 p-0"
            title="Bosh sahifaga qaytish"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <Bell className="h-6 w-6 text-yellow-500" /> Habarnomalar
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Kelgan bildirishnomalar va tizim xabarlari ro'yxati</p>
          </div>
        </div>

        {/* Middle: Search Input */}
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Xabarlarni qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4 text-zinc-400" />}
            className="h-11 rounded-xl bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {unreadCount > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white rounded-full px-3 py-1 font-semibold text-xs border-0">
              {unreadCount} ta o'qilmagan
            </Badge>
          )}
          <Button 
            onClick={handleMarkAllRead}
            disabled={notifications.length === 0}
            className="rounded-xl gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-11 px-4"
          >
            <CheckCheck className="h-4.5 w-4.5" /> Barchasini o'qilgan deb belgilash
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <Card className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
                onClick={() => toggleReadStatus(item.id)}
                className={`flex gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                  item.isRead 
                    ? "border-zinc-150 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-950/10 opacity-75" 
                    : "border-blue-100 bg-blue-50/10 dark:border-blue-950/20 dark:bg-blue-950/5 ring-1 ring-blue-500/10"
                }`}
              >
                {/* Type Icon */}
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border ${
                  item.type === "user" ? "bg-purple-50 border-purple-100 text-purple-650 dark:bg-purple-950/20 dark:border-purple-900/40 dark:text-purple-400" :
                  item.type === "payment" ? "bg-emerald-50 border-emerald-100 text-emerald-650 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400" :
                  item.type === "admin" ? "bg-blue-50 border-blue-100 text-blue-650 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-450" :
                  "bg-amber-50 border-amber-100 text-amber-650 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400"
                }`}>
                  {item.type === "user" && <UserPlus className="h-5 w-5" />}
                  {item.type === "payment" && <Wallet className="h-5 w-5" />}
                  {item.type === "admin" && <ShieldAlert className="h-5 w-5" />}
                  {item.type === "system" && <Calendar className="h-5 w-5" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm font-bold truncate ${item.isRead ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-950 dark:text-white"}`}>
                      {item.title}
                    </h3>
                    <span className="text-[10px] text-zinc-400 shrink-0 font-medium">{item.time}</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                {/* Status Dot / Delete Button */}
                <div className="flex flex-col justify-between items-end shrink-0 ml-2">
                  <div className="h-4 w-4 flex items-center justify-center">
                    {!item.isRead && (
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="h-8 w-8 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                    title="Xabarni o'chirish"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-zinc-400 dark:text-zinc-500 space-y-2">
              <Bell className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-800" />
              <p className="text-xs">Yangi xabarnomalar topilmadi</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
