"use client"

import { useState } from "react"
import { ShieldCheck, Plus, Trash2, Key, AlertTriangle, Search, Filter, X, Smartphone, Clock, Check, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface AdminAccount {
  username: string
  password: string
  fullName: string
  phone: string
  role: string
  lastLoginTime: string
  lastLoginDevice: string
  status: "active" | "blocked"
}

// Single administrator template for backend development
const initialAdmin: AdminAccount = {
  username: "admin",
  password: "SuperPassword123",
  fullName: "Jasur Rahimov",
  phone: "+998 90 999 88 77",
  role: "super_admin",
  lastLoginTime: "2026-07-04 15:30",
  lastLoginDevice: "Chrome (Windows 11)",
  status: "active"
}

export function AdminlarContent() {
  const [admin, setAdmin] = useState<AdminAccount>(initialAdmin)
  const [search, setSearch] = useState("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Drawer edit states
  const [editUsername, setEditUsername] = useState(admin.username)
  const [editPassword, setEditPassword] = useState(admin.password)
  const [editFullName, setEditFullName] = useState(admin.fullName)
  const [editPhone, setEditPhone] = useState(admin.phone)
  const [editStatus, setEditStatus] = useState<"active" | "blocked">(admin.status)

  const handleOpenDrawer = () => {
    setEditUsername(admin.username)
    setEditPassword(admin.password)
    setEditFullName(admin.fullName)
    setEditPhone(admin.phone)
    setEditStatus(admin.status)
    setIsDrawerOpen(true)
  }

  const handleSaveAndClose = () => {
    setAdmin({
      ...admin,
      username: editUsername,
      password: editPassword,
      fullName: editFullName,
      phone: editPhone,
      status: editStatus
    })
    setIsDrawerOpen(false)
    window.dispatchEvent(new CustomEvent("show-success-notification", { detail: { message: "Admin sozlamalari muvaffaqiyatli saqlandi!" } }))
  }

  const handleDelete = () => {
    if (confirm("Ushbu administrator hisobini o'chirib tashlashni tasdiqlaysizmi?")) {
      alert("Namuna hisob bo'lganligi sababli o'chirilmadi, backend ulanganda to'liq ishlaydi.")
      setIsDrawerOpen(false)
    }
  }

  // Simple mock filter
  const isMatch = admin.username.toLowerCase().includes(search.toLowerCase()) ||
                  admin.fullName.toLowerCase().includes(search.toLowerCase())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" /> Adminlar Boshqaruvi (Admins)
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Tizim administratorlari ro'yxati va ularning hisoblarini boshqarish bo'limi</p>
        </div>
        <Button className="rounded-xl gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4" /> Yangi admin qo'shish
        </Button>
      </div>

      {/* Top Search Input with Icons */}
      <Card className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Admin login yoki ism bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="h-4 w-4 text-zinc-400" />}
              className="h-11 rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-blue-500/20 dark:bg-zinc-900 dark:border-zinc-800"
            />
          </div>
          <Button variant="outline" className="h-11 rounded-xl gap-2 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 font-bold bg-white dark:bg-zinc-900">
            <Filter className="h-4 w-4" /> Filtrlar
          </Button>
        </div>
      </Card>

      {/* Admins Grid/List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isMatch ? (
          <Card 
            onClick={handleOpenDrawer}
            className="p-6 bg-white dark:bg-[#0d0d0d] border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl hover:border-blue-500/50 hover:shadow-md cursor-pointer transition-all relative group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-lg uppercase">
                  {admin.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-950 dark:text-white group-hover:text-blue-600 transition-colors">
                    {admin.fullName}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">@{admin.username}</p>
                </div>
              </div>

              {admin.status === "active" ? (
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400 rounded-full">
                  Faol
                </Badge>
              ) : (
                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400 rounded-full">
                  Bloklangan
                </Badge>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900 space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Telefon:</span>
                <span className="font-mono text-zinc-850 dark:text-zinc-300">{admin.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Rol:</span>
                <span className="font-semibold text-zinc-850 dark:text-zinc-300">{admin.role}</span>
              </div>
            </div>

            <div className="mt-4 pt-2 text-[10px] text-zinc-400 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Oxirgi kirish: {admin.lastLoginTime}
            </div>
          </Card>
        ) : (
          <div className="col-span-full py-12 text-center text-zinc-400 dark:text-zinc-500">
            Admin topilmadi
          </div>
        )}
      </div>

      {/* Slide-out Sidebar Drawer for Managing Selected Admin */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black z-45"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto text-zinc-900 dark:text-zinc-100"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-zinc-100 dark:border-zinc-900 mb-6">
                  <div>
                    <h2 className="text-base font-bold text-zinc-950 dark:text-white">Admin Hisobini Boshqarish</h2>
                    <p className="text-xs text-zinc-400 mt-1">Hisob tafsilotlarini o'zgartirish va bloklash</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsDrawerOpen(false)} 
                    className="h-8 w-8 rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-adm-name">Ism-familiya</Label>
                    <Input
                      id="edit-adm-name"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      className="h-11 rounded-xl bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-adm-username">Login (username)</Label>
                    <Input
                      id="edit-adm-username"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="h-11 rounded-xl bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-adm-pass">Parol</Label>
                    <div className="relative">
                      <Input
                        id="edit-adm-pass"
                        type={showPassword ? "text" : "password"}
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="h-11 rounded-xl pr-10 bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-adm-phone">Telefon raqam</Label>
                    <Input
                      id="edit-adm-phone"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="h-11 rounded-xl bg-white dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>

                  {/* Toggle block status */}
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-semibold">Hisobni bloklash</Label>
                      <p className="text-[10px] text-zinc-400">Bloklangan admin tizimga kira olmaydi</p>
                    </div>
                    <Switch
                      checked={editStatus === "blocked"}
                      onCheckedChange={(checked) => setEditStatus(checked ? "blocked" : "active")}
                    />
                  </div>

                  {/* Device and Time Logs */}
                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900 space-y-3 bg-zinc-50 dark:bg-zinc-900/30 p-4 rounded-xl text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Oxirgi kirish vaqti: <strong className="text-zinc-900 dark:text-white">{admin.lastLoginTime}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Qurilma: <strong className="text-zinc-900 dark:text-white">{admin.lastLoginDevice}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer footer actions */}
              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 flex flex-col gap-2 mt-6">
                <Button 
                  onClick={handleSaveAndClose}
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <Check className="h-4 w-4" /> Saqlash va Yopish
                </Button>
                <Button 
                  onClick={handleDelete}
                  variant="outline"
                  className="w-full h-11 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/40 dark:hover:bg-red-950/20 gap-2"
                >
                  <Trash2 className="h-4 w-4" /> Adminni o'chirib tashlash
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
